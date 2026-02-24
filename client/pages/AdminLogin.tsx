import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader, AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // User is logged in, redirect to admin
        navigate("/admin");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Invalid email or password");
        toast.error("Login failed");
      } else {
        toast.success("Login successful");
        navigate("/admin");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
      toast.error("Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-b from-primary/5 to-secondary/5 px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-border">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary mx-auto mb-4">
                <span className="text-white font-bold text-2xl">🔐</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t("admin")} Login
              </h1>
              <p className="text-muted-foreground">
                Enter your credentials to access the dashboard
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3">
                Need admin access? Contact your site administrator.
              </p>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground text-center">
                  <strong>Demo:</strong> Only users with "admin" role in
                  Supabase can login here.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Protected admin area</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
