import { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const verified = searchParams.get('verified');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  useEffect(() => {
    if (error) {
      setStatus('error');
    } else if (verified) {
      setStatus('success');
    } else {
      // Check if user is already authenticated
      if (user) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    }
  }, [verified, error, user]);

  // If user is authenticated, redirect to home
  if (user && status === 'success') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'success' ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-xl text-green-700">Email Verified!</CardTitle>
            </>
          ) : status === 'error' ? (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-xl text-red-700">Verification Failed</CardTitle>
            </>
          ) : (
            <>
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
              <CardTitle className="text-xl text-gray-700">Verifying...</CardTitle>
            </>
          )}
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'success' ? (
            <>
              <p className="text-gray-600">
                Your email has been successfully verified! You can now sign in to your account.
              </p>
              <Button 
                onClick={() => window.location.href = '/'} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Go to Sign In
              </Button>
            </>
          ) : status === 'error' ? (
            <>
              <p className="text-gray-600">
                {errorDescription || 'There was an error verifying your email. Please try again or contact support.'}
              </p>
              <Button 
                onClick={() => window.location.href = '/'} 
                variant="outline" 
                className="w-full"
              >
                Back to Home
              </Button>
            </>
          ) : (
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;