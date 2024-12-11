import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { ReceiptViewer } from "./license/ReceiptViewer";
import { LicenseTable } from "./license/LicenseTable";
import type { PaymentReceipt } from "./license/types";

export const LicenseManagement = () => {
  const queryClient = useQueryClient();
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  const { data: receipts, isLoading } = useQuery({
    queryKey: ["admin-receipts"],
    queryFn: async () => {
      const { data: receiptsData, error: receiptsError } = await supabase
        .from("payment_receipts")
        .select(`
          *,
          profile:profiles(*)
        `)
        .order("created_at", { ascending: false });

      if (receiptsError) throw receiptsError;
      return receiptsData as PaymentReceipt[];
    },
  });

  const updateLicenseMutation = useMutation({
    mutationFn: async ({
      userId,
      status,
      receiptId,
    }: {
      userId: string;
      status: "approved" | "rejected";
      receiptId: string;
    }) => {
      const { error: receiptError } = await supabase
        .from("payment_receipts")
        .update({ status })
        .eq("id", receiptId);

      if (receiptError) throw receiptError;

      if (status === "approved") {
        const { error: licenseError } = await supabase
          .from("user_licenses")
          .update({
            has_lifetime_access: true,
            payment_status: "completed",
          })
          .eq("user_id", userId);

        if (licenseError) throw licenseError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-receipts"] });
      toast.success("License status updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update license status");
      console.error("License update error:", error);
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
    return <div>Loading licenses...</div>;
  }

  return (
    <>
      <div className="rounded-md border">
        <LicenseTable
          receipts={receipts || []}
          onViewReceipt={handleViewReceipt}
          onUpdateStatus={(userId, status, receiptId) =>
            updateLicenseMutation.mutate({ userId, status, receiptId })
          }
        />
      </div>

      <ReceiptViewer
        receiptUrl={receiptUrl}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </>
  );
};