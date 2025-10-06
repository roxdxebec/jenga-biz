import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function BillingReturn() {
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [message, setMessage] = useState<string>('Validating your payment...');
  useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const poll = async () => {
      try {
        // Small delay to allow webhook processing
        await new Promise(r => setTimeout(r, 1200));
        const sub = await apiClient.getMySubscription();
        if (sub && sub.status === 'active') {
          if (!isMounted) return;
          setStatus('success');
          setMessage('Subscription is active. Thank you!');
          return;
        }
        // Try a couple more times
        await new Promise(r => setTimeout(r, 1800));
        const sub2 = await apiClient.getMySubscription();
        if (sub2 && sub2.status === 'active') {
          if (!isMounted) return;
          setStatus('success');
          setMessage('Subscription is active. Thank you!');
        } else {
          if (!isMounted) return;
          setStatus('failed');
          setMessage('We could not confirm your subscription yet. If you paid, it should activate shortly.');
        }
      } catch (e) {
        if (!isMounted) return;
        setStatus('failed');
        setMessage('An error occurred while checking your subscription status.');
      }
    };

    poll();
    return () => { isMounted = false; };
  }, []);

  const goDashboard = () => {
    navigate('/dashboard');
  };

  const icon = status === 'pending' ? <Loader2 className="h-6 w-6 animate-spin" /> : status === 'success' ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <XCircle className="h-6 w-6 text-red-600" />;

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          {icon}
          <CardTitle>Subscription Update</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">{message}</p>
          <div className="flex gap-2">
            <Button onClick={goDashboard}>Go to Dashboard</Button>
            <Button variant="outline" onClick={() => navigate('/')}>Home</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
