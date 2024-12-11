import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Pricing = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { data: license, refetch } = useQuery({
    queryKey: ["user-license", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      // First try to get existing license
      const { data, error } = await supabase
        .from("user_licenses")
        .select("*")
        .eq("user_id", session.user.id);

      // If no license exists, create one
      if ((!data || data.length === 0) && !error) {
        const { data: newLicense, error: createError } = await supabase
          .from("user_licenses")
          .insert([
            { 
              user_id: session.user.id,
              trial_start_date: new Date().toISOString(),
              trial_end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 1 day trial
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error("Error creating license:", createError);
          throw createError;
        }

        return newLicense;
      }

      if (error) throw error;
      return data[0]; // Return the first license if multiple exist
    },
    enabled: !!session?.user?.id,
  });

  const handlePurchase = async () => {
    if (!session) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke("handle-paytr", {
        body: { user_id: session.user.id }
      });

      if (response.error) throw response.error;

      toast.success("Ödeme işlemi başlatıldı");
      refetch(); // Refresh license data after payment
    } catch (error) {
      toast.error("Ödeme işlemi başlatılırken bir hata oluştu");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isTrialActive = license && new Date(license.trial_end_date) > new Date();
  const hasLifetimeAccess = license?.has_lifetime_access;

  return (
    <div className="py-20 px-4 bg-accent">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Simple Pricing</h2>
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-5xl font-bold text-primary mb-4">$50</div>
          <div className="text-xl font-semibold mb-6">Lifetime Access</div>
          <ul className="text-secondary space-y-4 mb-8">
            <li>✓ Unlimited Campaign Tracking</li>
            <li>✓ Performance Analytics</li>
            <li>✓ Future Planning Tools</li>
            <li>✓ Free Lifetime Updates</li>
          </ul>
          <Button
            onClick={handlePurchase}
            disabled={isLoading || hasLifetimeAccess}
            className="w-full"
          >
            {hasLifetimeAccess
              ? "You have lifetime access"
              : isTrialActive
              ? "Get Lifetime Access"
              : "Trial Ended - Upgrade Now"}
          </Button>
          {isTrialActive && license && (
            <p className="mt-4 text-sm text-muted-foreground">
              Trial ends in{" "}
              {Math.ceil(
                (new Date(license.trial_end_date).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              days
            </p>
          )}
        </div>
      </div>
    </div>
  );
};