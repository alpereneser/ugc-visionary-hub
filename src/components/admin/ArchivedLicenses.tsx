import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ReceiptViewer } from "./license/ReceiptViewer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { PaymentReceipt } from "./license/types";

export const ArchivedLicenses = () => {
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  const { data: archivedReceipts, isLoading } = useQuery({
    queryKey: ["admin-archived-receipts"],
    queryFn: async () => {
      const { data: receiptsData, error: receiptsError } = await supabase
        .from("payment_receipts")
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('status', 'rejected')
        .order("created_at", { ascending: false });

      if (receiptsError) throw receiptsError;
      return receiptsData as PaymentReceipt[];
    },
  });

  const handleViewReceipt = async (filePath: string) => {
    try {
      const { data } = await supabase.storage
        .from("payment_receipts")
        .createSignedUrl(filePath, 60);

      if (data?.signedUrl) {
        setReceiptUrl(data.signedUrl);
        setSelectedReceipt(filePath);
      }
    } catch (error) {
      console.error("Error getting receipt URL:", error);
      toast.error("Failed to load receipt");
    }
  };

  if (isLoading) {
    return <div>Loading archived licenses...</div>;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {archivedReceipts?.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell>
                  {receipt.profile?.email}
                  <br />
                  <span className="text-sm text-muted-foreground">
                    {receipt.profile?.full_name}
                  </span>
                </TableCell>
                <TableCell>${receipt.amount}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-red-50 text-red-700">
                    {receipt.status}
                  </span>
                </TableCell>
                <TableCell>
                  {format(new Date(receipt.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewReceipt(receipt.file_path)}
                  >
                    View Receipt
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ReceiptViewer
        receiptUrl={receiptUrl}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </>
  );
};