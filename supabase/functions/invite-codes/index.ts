import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { 
  getUserFromRequest, 
  requireAdmin, 
  requireSuperAdmin, 
  isAdmin,
  isHubManager,
  getServiceRoleClient,
  AuthError 
} from '../_shared/auth.ts';
import { 
  handleCors, 
  successResponse, 
  errorResponse, 
  handleError 
} from '../_shared/responses.ts';
import {
  validateBody,
  validateQuery,
  createInviteCodeSchema,
  validateInviteCodeQuerySchema,
  consumeInviteCodeSchema,
} from '../_shared/validation.ts';

// Utility to generate a random invite code
function generateInviteCode(length = 10): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const handler = async (req: Request): Promise<Response> => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCors();
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    const method = req.method;

    if (method === 'GET' && path === 'health') {
      return successResponse({ status: 'ok', service: 'invite-codes' });
    }

    if (method === 'POST' && path === 'invite-codes') {
      return await createInviteCode(req);
    }

    if (method === 'GET' && path === 'validate') {
      return await validateInviteCode(req);
    }

    if (method === 'POST' && path === 'consume') {
      return await consumeInviteCode(req);
    }

    return errorResponse('NOT_FOUND', 'Endpoint not found', 404);
  } catch (error) {
    return handleError(error);
  }
};

// POST /invite-codes
// Create an invite code. Super Admin can create both organization and business invites.
// Hub Manager/Admin can create only business (entrepreneur) invites tied to their hub context.
async function createInviteCode(req: Request): Promise<Response> {
  const { user, supabase } = await getUserFromRequest(req);
  // At minimum require hub_manager/admin or super_admin
  requireAdmin(user);

  const body = await validateBody(req, createInviteCodeSchema) as z.infer<typeof createInviteCodeSchema>;

  // Enforce RBAC: non-super-admins cannot create organization invites
  if (body.account_type === 'organization') {
    requireSuperAdmin(user);
  }

  // Determine inviter hub context if creator is hub_manager/admin
  let inviterHubId: string | null = null;
  if (isHubManager(user) || isAdmin(user)) {
    const { data: rolesRows, error: rolesErr } = await supabase
      .from('user_roles')
      .select('hub_id, role')
      .eq('user_id', user.id);
    if (rolesErr) throw rolesErr;
    const hubContext = (rolesRows || []).find(r => (r.role === 'hub_manager' || r.role === 'admin') && r.hub_id);
    inviterHubId = hubContext?.hub_id || null;
  }

  const code = generateInviteCode(12);
  const expiresAt = body.expires_at || new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(); // 14 days default

  const { data, error } = await supabase
    .from('invite_codes')
    .insert({
      code,
      invited_email: body.invited_email,
      account_type: body.account_type,
      created_by: user.id,
      expires_at: expiresAt,
    })
    .select('*')
    .single();

  if (error) throw error;

  return successResponse({
    ...data,
    hub_context: inviterHubId,
  }, 201);
}

// GET /invite-codes/validate?code=...
async function validateInviteCode(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const { code } = validateQuery(url, validateInviteCodeQuerySchema) as z.infer<typeof validateInviteCodeQuerySchema>;

  // Publicly accessible validation
  const nowIso = new Date().toISOString();
  const { data, error } = await (await import('https://esm.sh/@supabase/supabase-js@2')).createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!
  )
  .from('invite_codes')
  .select('*')
  .eq('code', code)
  .is('used_at', null)
  .gte('expires_at', nowIso)
  .maybeSingle();

  if (error) throw error;
  if (!data) {
    return successResponse({ valid: false });
  }

  return successResponse({
    valid: true,
    invite: {
      code: data.code,
      account_type: data.account_type,
      invited_email: data.invited_email,
      expires_at: data.expires_at,
    }
  });
}

// POST /invite-codes/consume
// Body: { code, user_id }
// Marks invite as used and, if created by an organization/hub admin, links the user to that hub as entrepreneur.
async function consumeInviteCode(req: Request): Promise<Response> {
  const { user, supabase } = await getUserFromRequest(req);
  const { code, user_id } = await validateBody(req, consumeInviteCodeSchema) as z.infer<typeof consumeInviteCodeSchema>;

  if (user.id !== user_id && !isAdmin(user)) {
    throw new AuthError('Not allowed to consume invite for another user', 403);
  }

  // Fetch invite
  const { data: invite, error: inviteErr } = await supabase
    .from('invite_codes')
    .select('*')
    .eq('code', code)
    .is('used_at', null)
    .gte('expires_at', new Date().toISOString())
    .single();
  if (inviteErr) throw inviteErr;

  // Determine creator's hub context
  let creatorHubId: string | null = null;
  if (invite) {
    const { data: creatorRoles } = await supabase
      .from('user_roles')
      .select('hub_id, role')
      .eq('user_id', invite.created_by);
    const hubCtx = (creatorRoles || []).find(r => (r.role === 'hub_manager' || r.role === 'admin') && r.hub_id);
    creatorHubId = hubCtx?.hub_id || null;
  }

  // Mark invite as used
  const { error: updateErr } = await supabase
    .from('invite_codes')
    .update({ used_by: user_id, used_at: new Date().toISOString() })
    .eq('code', code);
  if (updateErr) throw updateErr;

  // If the invite is for a business account and there is a hub context, link user to hub as entrepreneur
  let linkedHubId: string | null = null;
  if (invite.account_type === 'business' && creatorHubId) {
    // Add user role entrepreneur with hub_id
    const { error: roleErr } = await supabase
      .from('user_roles')
      .insert({ user_id, role: 'entrepreneur', hub_id: creatorHubId });
    if (roleErr && roleErr.code !== '23505') { // ignore duplicate role
      throw roleErr;
    }
    linkedHubId = creatorHubId;
  }

  // Return assigned plan suggestion based on rules and attempt assignment when applicable
  let assignedPlan = linkedHubId ? 'premium' : 'free';
  let subscriptionAssigned = false;

  if (linkedHubId) {
    // Attempt to auto-assign Premium subscription using service role (bypass RLS)
    try {
      const serviceClient = getServiceRoleClient();
      const now = new Date();
      const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // naive 30-day period

      // Look up an active "Premium" plan (case-insensitive)
      const { data: premiumPlan, error: planErr } = await serviceClient
        .from('subscription_plans')
        .select('id, name, is_active')
        .ilike('name', 'premium')
        .eq('is_active', true)
        .maybeSingle();

      if (planErr) {
        // If table missing, ignore; otherwise rethrow
        if ((planErr as any).code !== '42P01') throw planErr;
      }

      if (premiumPlan?.id) {
        // Check if user already has an active subscription
        const { data: existingSubs, error: subErr } = await serviceClient
          .from('user_subscriptions')
          .select('id, status, current_period_end')
          .eq('user_id', user_id)
          .eq('status', 'active')
          .gt('current_period_end', now.toISOString());

        if (subErr) {
          if ((subErr as any).code !== '42P01') throw subErr;
        }

        if (!existingSubs || existingSubs.length === 0) {
          const { error: assignErr } = await serviceClient
            .from('user_subscriptions')
            .insert({
              user_id,
              plan_id: premiumPlan.id,
              status: 'active',
              current_period_start: now.toISOString(),
              current_period_end: periodEnd.toISOString(),
            });

          if (assignErr) {
            if ((assignErr as any).code !== '42P01') throw assignErr;
          } else {
            subscriptionAssigned = true;
          }
        } else {
          subscriptionAssigned = true; // already has an active subscription
        }
      }
    } catch (e) {
      // Log and continue without failing invite consumption
      console.error('Premium auto-assignment error:', e);
    }
  }

  return successResponse({
    consumed: true,
    linked_hub_id: linkedHubId,
    assigned_plan: assignedPlan,
    subscription_assigned: subscriptionAssigned,
  });
}

serve(handler);
