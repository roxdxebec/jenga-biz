import { useEffect, useState } from 'react';
import { apiClient, ApiError } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  billing_cycle: string;
  features: Record<string, any>;
  is_active: boolean;
}

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyPlan, setBusyPlan] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const list = await apiClient.listPlans();
        const normalized = (Array.isArray(list) ? list : []).filter((p: any) => p.is_active);
        setPlans(normalized);
      } catch (e: any) {
        const msg = e?.error?.message || 'Failed to load plans';
        toast({ title: 'Error', description: msg, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const handleSubscribe = async (planId: string) => {
    try {
      setBusyPlan(planId);
      const ret = await apiClient.initiatePaystack(planId, `${window.location.origin}/billing/return`);
      if (ret?.authorization_url) {
        window.location.href = ret.authorization_url;
      } else {
        toast({ title: 'Payment Error', description: 'No authorization URL received', variant: 'destructive' });
      }
    } catch (e: any) {
      const msg = e?.error?.message || 'Failed to initiate payment';
      toast({ title: 'Payment Error', description: msg, variant: 'destructive' });
    } finally {
      setBusyPlan(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Pricing</h1>
        <p className="text-muted-foreground mt-2">Development pricing is set to 1 KES for paid tiers.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading plans...
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const isFree = Number(plan.price) === 0;
            return (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-3xl font-semibold">
                      {plan.currency} {Number(plan.price).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">{plan.billing_cycle}</div>
                  </div>
                  {isFree ? (
                    <Button variant="outline" className="w-full" disabled>
                      Free (Dev: all features available)
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => handleSubscribe(plan.id)} disabled={busyPlan === plan.id}>
                      {busyPlan === plan.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redirecting...
                        </>
                      ) : (
                        <>Subscribe</>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
