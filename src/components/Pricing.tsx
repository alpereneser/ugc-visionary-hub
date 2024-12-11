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
import { Sparkles } from "lucide-react";

export const Pricing = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    <div className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-3xl" />
      
      <div className="max-w-3xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Simple Pricing
          </h2>
          <p className="mt-4 text-gray-400">
            One plan, unlimited possibilities
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl transition-all duration-300"
               style={{ transform: isHovered ? 'scale(1.02)' : 'scale(0.98)' }} />
          
          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                <div className="text-5xl font-bold text-white">$50</div>
              </div>
              <div className="text-xl font-medium text-primary/80 mb-8">Lifetime Access</div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited Campaign Tracking",
                  "Performance Analytics",
                  "Future Planning Tools",
                  "Free Lifetime Updates"
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-2 text-gray-300"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogTrigger asChild>
                  <Button
                    onClick={handlePurchase}
                    disabled={isLoading || hasLifetimeAccess}
                    className="w-full max-w-xs bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-pink-500/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
                  className="mt-4 text-sm text-gray-400"
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};