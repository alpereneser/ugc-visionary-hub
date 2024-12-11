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
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Bank Transfer Details</h3>
        <p className="text-sm text-muted-foreground">
          Please use the following bank account details to make your payment:
        </p>
      </div>

      <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
        <div>
          <p className="font-medium">Bank: Example Bank</p>
          <p>Account Name: Your Company Name</p>
          <p>IBAN: TR00 0000 0000 0000 0000 0000 00</p>
          <p>Swift Code: EXAMPLECODE</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          After making the payment, click the button below to submit your request for approval.
        </p>
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