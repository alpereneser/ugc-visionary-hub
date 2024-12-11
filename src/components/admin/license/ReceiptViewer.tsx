import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReceiptViewerProps {
  receiptUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptViewer = ({ receiptUrl, isOpen, onClose }: ReceiptViewerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Payment Receipt</DialogTitle>
        </DialogHeader>
        {receiptUrl && (
          <div className="mt-4">
            {receiptUrl.toLowerCase().endsWith('.pdf') ? (
              <iframe
                src={receiptUrl}
                className="w-full h-[600px]"
                title="Payment Receipt"
              />
            ) : (
              <img
                src={receiptUrl}
                alt="Payment Receipt"
                className="w-full h-auto max-h-[600px] object-contain"
              />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};