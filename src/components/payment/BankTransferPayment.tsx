import { Mail } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const BankTransferPayment = () => {
  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Bank Transfer Payment</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Bank Account Details</h3>
          <div className="rounded-lg border p-4 space-y-3">
            <div>
              <p className="text-sm font-medium">Bank Name</p>
              <p className="text-sm text-muted-foreground">Your Bank Name</p>
            </div>
            <div>
              <p className="text-sm font-medium">Account Name</p>
              <p className="text-sm text-muted-foreground">Your Company Name</p>
            </div>
            <div>
              <p className="text-sm font-medium">IBAN</p>
              <p className="text-sm text-muted-foreground">Your IBAN Number</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-blue-800 font-medium italic text-sm">
            "Your payment will be verified after the transfer is completed. Once verified, your Lifetime License will be activated."
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Need Help?</h3>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground mb-2">
              Contact our support team at:
            </p>
            <a 
              href="mailto:support@tracefluence.com" 
              className="text-primary hover:underline flex items-center gap-2 text-sm"
            >
              <Mail className="h-4 w-4" />
              support@tracefluence.com
            </a>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Upload Payment Receipt</h3>
          <input
            type="file"
            accept="image/*,.pdf"
            className="w-full"
            onChange={(e) => {
              // Handle file upload
              console.log(e.target.files?.[0]);
            }}
          />
        </div>
      </div>
    </div>
  );
};