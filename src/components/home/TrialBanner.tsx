import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BankTransferPayment } from "@/components/payment/BankTransferPayment";

interface TrialBannerProps {
  trialDaysLeft: number;
  hasLifetimeAccess: boolean;
}

export const TrialBanner = ({ trialDaysLeft, hasLifetimeAccess }: TrialBannerProps) => {
  if (hasLifetimeAccess) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-primary/20"
    >
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        {trialDaysLeft > 0 ? `${trialDaysLeft} Days Left in Trial` : "Trial Period Ended"}
      </h2>
      <p className="text-muted-foreground mb-4">
        Get lifetime access to all features of UGC Tracker. 
        Pay once, use forever!
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Get Lifetime License - $50
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <BankTransferPayment />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};