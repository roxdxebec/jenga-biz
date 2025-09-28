/**
 * User Management Edge Function
 * Handles all user-related operations with proper authorization and validation
 */

import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { getUserFromRequest, requireAdmin, requireSuperAdmin, AuthError } from '../_shared/auth.ts';
import {
  validateBody, 
  validateQuery, 
  updateProfileSchema, 
  updateUserRoleSchema, 
  getUsersQuerySchema,
  sanitizeString 
} from '../_shared/validation.ts';
import { 
  handleCors, 
  successResponse, 
  errorResponse, 
  handleError, 
  paginatedResponse,
  noContentResponse 
} from '../_shared/responses.ts';

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCors();
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    const method = req.method;

    // Route handling
    if (method === 'GET' && path === 'me') {
      return await getUserProfile(req);
    }
    
    if (method === 'PATCH' && path === 'me') {
      return await updateUserProfile(req);
    }
    
    if (method === 'GET' && path === 'user-management') {
      return await getUsers(req);
    }
    
    if (method === 'POST' && path === 'roles') {
      return await updateUserRole(req);
    }
    
    if (method === 'PATCH' && url.searchParams.has('userId')) {
      return await adminUpdateUser(req);
    }
    
    if (method === 'DELETE' && url.searchParams.has('userId')) {
      return await deactivateUser(req);
    }

    if (method === 'GET' && path === 'health') {
      return successResponse({ status: 'ok', service: 'user-management' });
    }

    return errorResponse('NOT_FOUND', 'Endpoint not found', 404);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get current user profile and roles
 * GET /user-management/me
 */
async function getUserProfile(req: Request): Promise<Response> {
  const { user, supabase } = await getUserFromRequest(req);
  
  // Get full profile data
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  return successResponse({
    id: user.id,
    email: user.email,
    roles: user.roles,
    ...profile,
  });
}

/**
 * Update current user's profile
 * PATCH /user-management/me
 */
async function updateUserProfile(req: Request): Promise<Response> {
  const { user, supabase } = await getUserFromRequest(req);
  const updates = await validateBody(req, updateProfileSchema) as z.infer<typeof updateProfileSchema>;

  // Sanitize string inputs
  const sanitizedUpdates = {
    ...updates,
    ...(updates.full_name && { full_name: sanitizeString(updates.full_name) }),
    ...(updates.organization_name && { organization_name: sanitizeString(updates.organization_name) }),
  };

  const { data, error } = await supabase
    .from('profiles')
    .update(sanitizedUpdates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return successResponse(data);
}

/**
 * Get users list (admin only)
 * GET /user-management
 */
async function getUsers(req: Request): Promise<Response> {
  const { user, supabase } = await getUserFromRequest(req);
  requireAdmin(user);

  const url = new URL(req.url);
  const query = validateQuery(url, getUsersQuerySchema) as z.infer<typeof getUsersQuerySchema>;
  const { page, limit, search, role, accountType } = query;
  
  const offset = (page - 1) * limit;

  // Build query for profiles only
  let dbQuery = supabase
    .from('profiles')
    .select(`
      id, 
      email, 
      full_name, 
      account_type, 
      country, 
      organization_name, 
      created_at
    `);

  // Apply filters
  if (search) {
    const searchTerm = `%${search.toLowerCase()}%`;
    dbQuery = dbQuery.or(`email.ilike.${searchTerm},full_name.ilike.${searchTerm}`);
  }

  if (accountType) {
    dbQuery = dbQuery.eq('account_type', accountType);
  }

  // Get total count
  const { count } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true });

  // Get paginated data
  const { data: profiles, error } = await dbQuery
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Fetch all user_roles for the returned profiles
  const userIds = profiles?.map((profile: any) => profile.id) || [];
  let rolesMap: Record<string, string[]> = {};
  if (userIds.length > 0) {
    let rolesQuery = supabase
      .from('user_roles')
      .select('user_id, role');
    if (role) {
      rolesQuery = rolesQuery.eq('role', role);
    }
    const { data: rolesData, error: rolesError } = await rolesQuery.in('user_id', userIds);
    if (rolesError) {
      throw rolesError;
    }
    // Build a map of user_id to roles
    for (const r of rolesData || []) {
      if (!rolesMap[r.user_id]) rolesMap[r.user_id] = [];
      rolesMap[r.user_id].push(r.role);
    }
  }

  // Transform data to match frontend expectations
  const users = profiles?.map((profile: any) => ({
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    account_type: profile.account_type,
    country: profile.country,
    organization_name: profile.organization_name,
    created_at: profile.created_at,
    roles: rolesMap[profile.id] || [],
  })) || [];

  return paginatedResponse(users, {
    page,
    limit,
    total: count || 0,
  });
}

/**
 * Update user role (admin only)
 * POST /user-management/roles
 */
async function updateUserRole(req: Request): Promise<Response> {
  const { user, supabase } = await getUserFromRequest(req);
  requireAdmin(user);

  const { userId, role, action } = await validateBody(req, updateUserRoleSchema) as z.infer<typeof updateUserRoleSchema>;
  
  // Super admin role changes require super admin privileges
  if (role === 'super_admin') {
    requireSuperAdmin(user);
  }

  // Use the secure RPC functions from the database
  const rpcFunction = action === 'add' 
    ? 'add_user_role_with_audit' 
    : 'remove_user_role_with_audit';

  const rpcParams = action === 'add' 
    ? {
        target_user_id: userId,
        new_role: role,
        requester_ip: null,
        requester_user_agent: req.headers.get('user-agent'),
      }
    : {
        target_user_id: userId,
        old_role: role,
        requester_ip: null,
        requester_user_agent: req.headers.get('user-agent'),
      };

  const { data, error } = await supabase.rpc(rpcFunction, rpcParams);

  if (error) {
    throw error;
  }

  if (!data) {
    return errorResponse(
      'ROLE_UNCHANGED',
      action === 'add' 
        ? 'User already has this role' 
        : 'User does not have this role',
      200
    );
  }

  return successResponse({
    userId,
    role,
    action,
    message: `User role ${action === 'add' ? 'added' : 'removed'} successfully`,
  });
}

/**
 * Admin update user (super admin only)
 * PATCH /user-management?userId=uuid
 */
async function adminUpdateUser(req: Request): Promise<Response> {
  const { user, supabase } = await getUserFromRequest(req);
  requireSuperAdmin(user);

  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  
  if (!userId) {
    return errorResponse('MISSING_USER_ID', 'User ID is required', 400);
  }

  const updates = await validateBody(req, updateProfileSchema) as z.infer<typeof updateProfileSchema>;

  // Sanitize string inputs
  const sanitizedUpdates = {
    ...updates,
    ...(updates.full_name && { full_name: sanitizeString(updates.full_name) }),
    ...(updates.organization_name && { organization_name: sanitizeString(updates.organization_name) }),
  };

  const { data, error } = await supabase
    .from('profiles')
    .update(sanitizedUpdates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return successResponse(data);
}

/**
 * Deactivate user (super admin only)
 * DELETE /user-management?userId=uuid
 */
async function deactivateUser(req: Request): Promise<Response> {
  const { user, supabase } = await getUserFromRequest(req);
  requireSuperAdmin(user);

  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  
  if (!userId) {
    return errorResponse('MISSING_USER_ID', 'User ID is required', 400);
  }

  // Remove all roles first
  const { error: rolesError } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId);

  if (rolesError) {
    throw rolesError;
  }

  // Mark account as deactivated
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ account_type: 'deactivated' })
    .eq('id', userId);

  if (profileError) {
    throw profileError;
  }

  return successResponse({
    userId,
    message: 'User deactivated successfully',
  });
}

serve(handler);