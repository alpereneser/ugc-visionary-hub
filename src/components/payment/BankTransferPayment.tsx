import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const BankTransferPayment = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      // Create a payment receipt record
      const { data: receipt, error: receiptError } = await supabase
        .from("payment_receipts")
        .insert({
          user_id: session.user.id,
          profile_id: session.user.id,
          amount: 50,
          file_path: "pending",
          status: "pending"
        })
        .select()
        .single();

      if (receiptError) throw receiptError;

      setShowConfirmation(true);
    } catch (error: any) {
      console.error("Error submitting payment:", error);
      toast.error("Failed to submit payment request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <h3 className="font-semibold">Bank Transfer Details</h3>
          <div className="grid gap-1">
            <div className="text-sm">
              <span className="font-medium">Bank:</span> Example Bank
            </div>
            <div className="text-sm">
              <span className="font-medium">Account Name:</span> Your Company Name
            </div>
            <div className="text-sm">
              <span className="font-medium">IBAN:</span> TR00 0000 0000 0000 0000 0000 00
            </div>
            <div className="text-sm">
              <span className="font-medium">Swift Code:</span> EXAMPLECODE
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Sending..." : "Send for License Approval"}
        </Button>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>License Request Submitted</DialogTitle>
            <DialogDescription>
              Your license request has been sent for approval. We will review your request and notify you via email once it's approved. Your license will be automatically activated upon approval.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => {
              setShowConfirmation(false);
              navigate("/home");
            }}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};