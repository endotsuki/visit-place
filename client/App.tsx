import "./global.css";
import "./lib/i18n";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { initTheme } from "@/lib/theme";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

// Initialize theme on app load
initTheme();

const queryClient = new QueryClient();

const RootApp = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = localStorage.getItem("language") || "km";
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [i18n]);

  return (
    <Switch>
      <Route path="/" component={Index} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route component={NotFound} /> {/* catch-all */}
    </Switch>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RootApp />
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
