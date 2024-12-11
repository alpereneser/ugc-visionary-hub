import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2 } from "lucide-react";

export const BankTransferPayment = () => {
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const navigate = useNavigate();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.id) return;

    setIsUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('payment_receipts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create payment receipt record
      const { error: dbError } = await supabase
        .from('payment_receipts')
        .insert({
          user_id: session.user.id,
          file_path: filePath,
          amount: 50, // Fixed price for lifetime access
        });

      if (dbError) throw dbError;

      toast.success("Receipt uploaded successfully! We'll review it shortly.");
      navigate("/home");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload receipt. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Bank Transfer Details</h2>
        <p className="text-sm text-muted-foreground">
          Please transfer the exact amount and upload your receipt
        </p>
      </div>

      <div className="space-y-4">
        <div className="border rounded p-4 space-y-2">
          <p className="font-medium">Amount: $50</p>
          <p>Bank: Your Bank Name</p>
          <p>Account Name: Your Company Name</p>
          <p>IBAN: XX00 0000 0000 0000</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="receipt">Upload Payment Receipt</Label>
          <Input
            id="receipt"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </div>

        <Button
          disabled={isUploading}
          className="w-full"
          variant="outline"
          onClick={() => document.getElementById('receipt')?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Receipt
            </>
          )}
        </Button>
      </div>
    </div>
  );
};