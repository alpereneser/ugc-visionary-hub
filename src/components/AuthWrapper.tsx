import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        if (!isSessionLoading) {
          if (!session && mounted) {
            toast.error("Please login to continue");
            navigate("/login", { replace: true });
          }
          if (mounted) {
            setIsChecking(false);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (mounted) {
          toast.error("Authentication error occurred");
          navigate("/login", { replace: true });
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [session, isSessionLoading, navigate]);

  if (isChecking || isSessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
};