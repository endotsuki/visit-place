import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { AlertCircle, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// Shared input style (consistent with AdminForm)
const inputCls =
  "h-11 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 px-4 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate("/admin");
    });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) {
      setError("Invalid email or password");
      toast.error("Login failed");
    } else {
      toast.success("Welcome back!");
      navigate("/admin");
    }
    setLoading(false);
  }

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-stone-50 dark:bg-stone-950 px-4 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {/* Card */}
          <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-xl shadow-stone-200/50 dark:shadow-stone-950/50 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-primary to-primary/80" />

            <div className="px-8 py-8">
              {/* Icon + heading */}
              <div className="mb-7 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 dark:shadow-primary/40">
                  <span className="text-2xl select-none">🔐</span>
                </div>
                <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                  Admin Login
                </h1>
                <p className="mt-1 text-sm text-stone-400 dark:text-stone-500">
                  Enter your credentials to continue
                </p>
              </div>

              {/* Error banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-5 overflow-hidden"
                  >
                    <div className="flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                      <HugeiconsIcon
                        icon={AlertCircle}
                        className="mt-0.5 h-4 w-4 shrink-0"
                      />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading || !email || !password}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {loading && (
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      className="h-4 w-4 animate-spin"
                    />
                  )}
                  {loading ? "Signing in…" : "Sign in"}
                </motion.button>
              </form>
            </div>

            {/* Footer note */}
            <div className="border-t border-stone-100 dark:border-stone-800 px-8 py-4 text-center text-xs text-stone-400 dark:text-stone-500">
              Only Supabase admin users can access this area.
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-stone-400 dark:text-stone-600">
            Protected admin area
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
