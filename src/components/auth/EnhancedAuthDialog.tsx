import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, AlertCircle, Building2, Users, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EnhancedAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnhancedAuthDialog({ open, onOpenChange }: EnhancedAuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    email: "", 
    password: "", 
    fullName: "",
    accountType: "business",
    inviteCode: ""
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [inviteCodeValid, setInviteCodeValid] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: "" });
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push("at least 8 characters");

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("an uppercase letter");

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("a lowercase letter");

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push("a number");

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push("a special character");

    const strengthText = feedback.length === 0 
      ? "Strong password!" 
      : `Password needs: ${feedback.join(", ")}`;

    setPasswordStrength({ score, feedback: strengthText });
  };

  // Validate invite code
  const validateInviteCode = async (code: string) => {
    if (!code.trim()) {
      setInviteCodeValid(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('invite_codes')
        .select('*')
        .eq('code', code.trim())
        .is('used_at', null)
        .gte('expires_at', new Date().toISOString())
        .single();

      setInviteCodeValid(!error && !!data);
    } catch {
      setInviteCodeValid(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      // Dialog will auto-close due to auth state change
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password strength
    if (passwordStrength.score < 4) {
      toast({
        title: "Password Too Weak",
        description: passwordStrength.feedback,
        variant: "destructive",
      });
      return;
    }

    // Validate invite code for organizations
    if (signupData.accountType === 'organization' && !signupData.inviteCode) {
      toast({
        title: "Invite Code Required",
        description: "Organization accounts require a valid invite code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(
      signupData.email, 
      signupData.password, 
      signupData.fullName,
      signupData.accountType,
      signupData.inviteCode || undefined
    );
    
    if (error) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });
      // Dialog will auto-close due to auth state change
    }
    
    setIsLoading(false);
  };

  // Auto-close dialog when user is authenticated
  if (user && open) {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-md ${!user ? '[&>button]:hidden' : ''}`}>
        <DialogHeader>
          <DialogTitle className="text-center text-foreground">Welcome to Jenga Biz Africa</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-card-foreground">Sign In</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember-me" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <Label htmlFor="remember-me" className="text-sm">Remember me</Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-card-foreground">Create Account</CardTitle>
                <CardDescription>Join us to start building your business strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your full name"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Account Type</Label>
                    <RadioGroup 
                      value={signupData.accountType} 
                      onValueChange={(value) => setSignupData({ ...signupData, accountType: value })}
                    >
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50">
                        <RadioGroupItem value="business" id="business" />
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <Label htmlFor="business" className="font-medium">Business</Label>
                          <p className="text-sm text-muted-foreground">For SMEs and entrepreneurs</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50">
                        <RadioGroupItem value="organization" id="organization" />
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <Label htmlFor="organization" className="font-medium">Organization</Label>
                          <p className="text-sm text-muted-foreground">For hubs, accelerators, TVETs</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {signupData.accountType === 'organization' && (
                    <div className="space-y-2">
                      <Label htmlFor="invite-code">Invite Code *</Label>
                      <Input
                        id="invite-code"
                        type="text"
                        placeholder="Enter your organization invite code"
                        value={signupData.inviteCode}
                        onChange={(e) => {
                          setSignupData({ ...signupData, inviteCode: e.target.value });
                          validateInviteCode(e.target.value);
                        }}
                        required
                      />
                      {inviteCodeValid === false && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>Invalid or expired invite code</AlertDescription>
                        </Alert>
                      )}
                      {inviteCodeValid === true && (
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>Valid invite code!</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={signupData.password}
                        onChange={(e) => {
                          setSignupData({ ...signupData, password: e.target.value });
                          checkPasswordStrength(e.target.value);
                        }}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                      >
                        {showSignupPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {signupData.password && (
                      <div className="text-sm">
                        <div className={`font-medium ${passwordStrength.score >= 4 ? 'text-green-600' : 'text-orange-600'}`}>
                          {passwordStrength.feedback}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded ${
                                i < passwordStrength.score ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Password must include: 8+ characters, uppercase & lowercase letters, numbers, and special characters.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || (signupData.accountType === 'organization' && !inviteCodeValid)}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}