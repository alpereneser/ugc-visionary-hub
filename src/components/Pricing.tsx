import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BankTransferPayment } from "./payment/BankTransferPayment";
import { motion } from "framer-motion";

export const Pricing = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const { data: license, refetch } = useQuery({
    queryKey: ["user-license", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("user_licenses")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching license:", error);
        toast.error("Failed to fetch license information");
        return null;
      }

      return data;
    },
    enabled: !!session?.user?.id,
    retry: 1,
  });

  const handlePurchase = () => {
    if (!session) {
      navigate("/login");
      return;
    }
    setShowPaymentDialog(true);
  };

  const isTrialActive = license && new Date(license.trial_end_date) > new Date();
  const hasLifetimeAccess = license?.has_lifetime_access;

  return (
    <div className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Simple Pricing
          </h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-primary/10 hover:border-primary/20 transition-all duration-300"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="text-5xl font-bold text-primary mb-2">$50</div>
            <div className="text-xl font-medium text-primary/80 mb-8">Lifetime Access</div>
            
            <ul className="space-y-4 mb-8 text-center">
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground"
              >
                ✓ Unlimited Campaign Tracking
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground"
              >
                ✓ Performance Analytics
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="text-muted-foreground"
              >
                ✓ Future Planning Tools
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="text-muted-foreground"
              >
                ✓ Free Lifetime Updates
              </motion.li>
            </ul>

            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
              <DialogTrigger asChild>
                <Button
                  onClick={handlePurchase}
                  disabled={isLoading || hasLifetimeAccess}
                  className="w-full max-w-xs bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {hasLifetimeAccess
                    ? "You have lifetime access"
                    : isTrialActive
                    ? "Get Lifetime Access"
                    : "Trial Ended - Upgrade Now"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <BankTransferPayment />
              </DialogContent>
            </Dialog>

            {isTrialActive && license && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 text-sm text-muted-foreground"
              >
                Trial ends in{" "}
                {Math.ceil(
                  (new Date(license.trial_end_date).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};