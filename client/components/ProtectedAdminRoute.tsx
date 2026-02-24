import { useEffect, useState } from "react";
import { checkAdminAccess } from "@/lib/auth";
import { Loader } from "lucide-react";
import { useLocation } from "wouter";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export default function ProtectedAdminRoute({
  children,
}: ProtectedAdminRouteProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const checkAdmin = async () => {
      const adminUser = await checkAdminAccess();
      if (!adminUser) {
        navigate("/"); // redirect if not admin
      } else {
        setIsAdmin(true);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
