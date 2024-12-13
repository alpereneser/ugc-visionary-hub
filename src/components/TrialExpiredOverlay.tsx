import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BankTransferPayment } from "@/components/payment/BankTransferPayment";

export const TrialExpiredOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/30 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 max-w-md mx-4"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Trial Period Ended</h2>
        <p className="text-gray-300 mb-6">
          Get lifetime access to all features of UGC Tracker. Pay once, use forever!
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Get Lifetime License - $50
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <BankTransferPayment />
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};