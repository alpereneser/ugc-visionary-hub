import { Heart, Mail, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Footer = () => {
  const session = useSession();

  const { data: license } = useQuery({
    queryKey: ["user-license", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("user_licenses")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const hasLifetimeAccess = license?.has_lifetime_access;
  const isTrialActive = license && new Date(license.trial_end_date) > new Date();

  return (
    <footer className="bg-white py-4 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span>We Make Passion</span>
            <Heart className="text-red-500 animate-pulse w-4 h-4" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <Link 
              to="/privacy" 
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <FileText className="w-4 h-4" />
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <FileText className="w-4 h-4" />
              Terms of Service
            </Link>
            <Link 
              to="/contact" 
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            {session && (
              <div className="text-sm mr-4">
                {hasLifetimeAccess ? (
                  <span className="text-primary font-medium">Lifetime Access</span>
                ) : (
                  <>
                    <span className="text-gray-600">License Day: </span>
                    {isTrialActive ? (
                      <span className="font-medium">1</span>
                    ) : (
                      <span className="text-red-500 font-medium">License Required</span>
                    )}
                  </>
                )}
              </div>
            )}
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} UGC Tracker
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};