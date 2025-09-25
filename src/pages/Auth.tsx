import { useEffect, useState } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { EnhancedAuthDialog } from '@/components/auth/EnhancedAuthDialog';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'login'>('loading');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const verified = searchParams.get('verified');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  useEffect(() => {
    // Don't process until auth loading is complete
    if (loading) return;
    
    if (error) {
      setStatus('error');
    } else if (verified) {
      setStatus('success');
    } else {
      // Check if user is already authenticated
      if (user) {
        setStatus('success');
      } else {
        setStatus('login');
        setShowAuthDialog(true);
      }
    }
  }, [verified, error, user, loading]);

  // If user is authenticated and we're not handling email verification, redirect to home
  if (user && !verified && !error) {
    return <Navigate to="/" replace />;
  }

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <img src="/jenga-biz-logo.png" alt="Jenga Biz Africa" className="h-12 w-auto" />
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      {status === 'login' ? (
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <p className="text-gray-600">Sign in to your Jenga Biz Africa account</p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button 
              onClick={() => setShowAuthDialog(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3"
            >
              Sign In / Sign Up
            </Button>
          </CardContent>
        </Card>
      ) : (
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
                  onClick={() => navigate('/')} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Go to Home
                </Button>
              </>
            ) : status === 'error' ? (
              <>
                <p className="text-gray-600">
                  {errorDescription || 'There was an error verifying your email. Please try again or contact support.'}
                </p>
                <Button 
                  onClick={() => navigate('/')} 
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
      )}

      {/* Auth Dialog */}
      <EnhancedAuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
    </div>
  );
};

export default Auth;