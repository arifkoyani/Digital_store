import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import bcrypt from "bcryptjs";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [signupData, setSignupData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (signupData.password !== signupData.confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }

      if (signupData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(signupData.password, 10);

      // Insert user into auth_users table
      const { data, error } = await supabase
        .from("auth_users")
        .insert([
          {
            email: signupData.email,
            username: signupData.username,
            password_hash: hashedPassword
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          toast.error("Email or username already exists");
        } else {
          toast.error("Signup failed: " + error.message);
        }
        return;
      }

      // Store user session in localStorage
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Account created successfully!");
      navigate("/");

    } catch (error: any) {
      toast.error("Signup failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get user from database
      const { data: user, error } = await supabase
        .from("auth_users")
        .select("*")
        .eq("email", loginData.email)
        .single();

      if (error || !user) {
        toast.error("Invalid email or password");
        return;
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(loginData.password, user.password_hash);
      
      if (!passwordMatch) {
        toast.error("Invalid email or password");
        return;
      }

      // Update last login
      await supabase
        .from("auth_users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", user.id);

      // Store user session in localStorage
      const userSession = {
        id: user.id,
        email: user.email,
        username: user.username,
        created_at: user.created_at
      };
      
      localStorage.setItem("user", JSON.stringify(userSession));
      toast.success("Login successful!");
      navigate("/");

    } catch (error: any) {
      toast.error("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    value={signupData.username}
                    onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;