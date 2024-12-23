import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { findUserLicense, updateOrCreateLicense } from "./licenseUtils";

export const AssignLicenseForm = () => {
  const [email, setEmail] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const assignLicenseMutation = useMutation({
    mutationFn: async (email: string) => {
      const { profile, existingLicense } = await findUserLicense(email);
      await updateOrCreateLicense(profile.id, true);
      return { profile, existingLicense };
    },
    onSuccess: () => {
      toast.success("Lifetime license assigned successfully");
      setEmail("");
    },
    onError: (error: Error) => {
      console.error("Error assigning license:", error);
      toast.error(error.message || "Failed to assign license");
    },
  });

  const handleAssignLicense = () => {
    if (!email || isAssigning) return;
    setIsAssigning(true);
    assignLicenseMutation.mutate(email, {
      onSettled: () => setIsAssigning(false),
    });
  };

  return (
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
  );
};