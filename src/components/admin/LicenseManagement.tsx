import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { ReceiptViewer } from "./license/ReceiptViewer";
import { LicenseTable } from "./license/LicenseTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PaymentReceipt } from "./license/types";

export const LicenseManagement = () => {
  const queryClient = useQueryClient();
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const { data: receipts, isLoading } = useQuery({
    queryKey: ["admin-receipts"],
    queryFn: async () => {
      const { data: receiptsData, error: receiptsError } = await supabase
        .from("payment_receipts")
        .select(`
          *,
          profiles!inner (
            id,
            email,
            full_name,
            company
          )
        `)
        .eq('status', 'pending')
        .order("created_at", { ascending: false });

      if (receiptsError) {
        console.error("Error fetching receipts:", receiptsError);
        throw receiptsError;
      }
      
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

  const handleAssignLicense = async () => {
    if (!email || isAssigning) return;

    setIsAssigning(true);
    try {
      // First, get the user's profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (profileError) {
        toast.error("User not found");
        return;
      }

      // Update or create the license
      const { error: licenseError } = await supabase
        .from("user_licenses")
        .upsert({
          profile_id: profile.id,
          has_lifetime_access: true,
          payment_status: "completed",
        });

      if (licenseError) throw licenseError;

      toast.success("Lifetime license assigned successfully");
      setEmail("");
    } catch (error) {
      console.error("Error assigning license:", error);
      toast.error("Failed to assign license");
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading) {
    return <div>Loading licenses...</div>;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="text-lg font-medium">Assign Lifetime License</h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email"
              />
            </div>
            <Button
              onClick={handleAssignLicense}
              disabled={!email || isAssigning}
            >
              {isAssigning ? "Assigning..." : "Assign License"}
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <LicenseTable
            receipts={receipts || []}
            onViewReceipt={handleViewReceipt}
            onUpdateStatus={(userId, status, receiptId) =>
              updateLicenseMutation.mutate({ userId, status, receiptId })
            }
          />
        </div>
      </div>

      <ReceiptViewer
        receiptUrl={receiptUrl}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </>
  );
};