import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, accountType?: string, inviteCode?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 useAuth - useEffect starting, initializing auth...');
    let initialSessionLoaded = false;

    // Set up auth state listener FIRST  
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔍 Auth state change - event:', event, 'session exists:', !!session);
        console.log('🔍 Auth state change - session user:', session?.user?.email || 'no user');
        console.log('🔍 Auth state change - initialSessionLoaded:', initialSessionLoaded);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        console.log('🔍 Auth state change - setting user to:', session?.user?.email || 'null');
        
        // Only set loading to false after initial session check OR on auth change
        if (initialSessionLoaded || event !== 'INITIAL_SESSION') {
          console.log('🔍 Auth state change - setting loading to false');
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('🔍 Initial session check - session exists:', !!session);
      console.log('🔍 Initial session check - session user:', session?.user?.email || 'no user');
      console.log('🔍 Initial session check - error:', error);
      
      setSession(session);
      setUser(session?.user ?? null);
      initialSessionLoaded = true;
      
      console.log('🔍 Initial session check - setting loading to false');
      setLoading(false);
    }).catch((error) => {
      console.error('🔍 Initial session check failed:', error);
      setLoading(false);
    });

    return () => {
      console.log('🔍 useAuth - cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, accountType?: string, inviteCode?: string) => {
    const redirectUrl = `${window.location.origin}/auth?verified=true`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          account_type: accountType || 'Business',
          invite_code: inviteCode,
        },
      },
    });

    // Custom email functions disabled - using default Supabase emails
    // if (!error) {
    //   try {
    //     await supabase.functions.invoke('send-signup-confirmation', {
    //       body: {
    //         email,
    //         confirmationUrl: redirectUrl
    //       }
    //     });
    //   } catch (emailError) {
    //     console.error('Error sending custom signup confirmation email:', emailError);
    //     // Don't return error for email sending failure, as the signup still works
    //   }
    // }
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    // Custom email functions disabled - using default Supabase emails
    // if (!error) {
    //   try {
    //     await supabase.functions.invoke('send-password-reset', {
    //       body: {
    //         to: email,
    //         resetUrl: redirectUrl,
    //       }
    //     });
    //   } catch (emailError) {
    //     console.error('Error sending custom password reset email:', emailError);
    //     // Don't return error for email sending failure, as the reset still works
    //   }
    // }
    
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}