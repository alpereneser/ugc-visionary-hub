import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  company: string | null;
  created_at: string;
}

interface PaymentReceipt {
  id: string;
  user_id: string | null;
  profile_id: string;
  file_path: string;
  status: string;
  amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  profile: Profile;
}

export const LicenseManagement = () => {
  const queryClient = useQueryClient();

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
      // Update payment receipt status
      const { error: receiptError } = await supabase
        .from("payment_receipts")
        .update({ status })
        .eq("id", receiptId);

      if (receiptError) throw receiptError;

      if (status === "approved") {
        // Update user license
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

  if (isLoading) {
    return <div>Loading licenses...</div>;
  }

  return (
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
          {receipts?.map((receipt) => (
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
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    receipt.status === "approved"
                      ? "bg-green-50 text-green-700"
                      : receipt.status === "rejected"
                      ? "bg-red-50 text-red-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {receipt.status}
                </span>
              </TableCell>
              <TableCell>
                {format(new Date(receipt.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {receipt.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() =>
                        updateLicenseMutation.mutate({
                          userId: receipt.user_id!,
                          status: "approved",
                          receiptId: receipt.id,
                        })
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        updateLicenseMutation.mutate({
                          userId: receipt.user_id!,
                          status: "rejected",
                          receiptId: receipt.id,
                        })
                      }
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};