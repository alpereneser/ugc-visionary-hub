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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const BankTransferPayment = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF, PNG, or JPG file');
        return;
      }
      
      setReceiptFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    if (!receiptFile) {
      toast.error("Please upload your payment receipt");
      return;
    }

    setIsLoading(true);
    try {
      // Upload file to storage
      const fileExt = receiptFile.name.split('.').pop();
      const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('payment_receipts')
        .upload(filePath, receiptFile);

      if (uploadError) throw uploadError;

      // Create payment receipt record
      const { data: receipt, error: receiptError } = await supabase
        .from("payment_receipts")
        .insert({
          user_id: session.user.id,
          profile_id: session.user.id,
          amount: 50,
          file_path: filePath,
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

        <div className="space-y-2">
          <Label htmlFor="receipt">Ödeme ekran görüntüsü ya da dekontunu yükleyiniz</Label>
          <Input
            id="receipt"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading || !receiptFile}
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