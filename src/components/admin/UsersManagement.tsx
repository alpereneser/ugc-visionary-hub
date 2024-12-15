import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { UsersTable } from "./users/UsersTable";
import { DeleteUserDialog } from "./users/DeleteUserDialog";

export const UsersManagement = () => {
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async () => {
    if (!userToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      // First, update the payment receipt status to 'deleted'
      const { error: updateError } = await supabase
        .from("payment_receipts")
        .update({ status: 'deleted' })
        .eq("profile_id", userToDelete);

      if (updateError) {
        console.error("Error updating payment receipt:", updateError);
      }

      // Then proceed with user deletion using the edge function
      const { error } = await supabase.functions.invoke('admin-operations', {
        body: {
          action: 'deleteUser',
          userId: userToDelete,
        },
      });

      if (error) throw error;

      toast.success("User deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const handlePasswordReset = async (email: string) => {
    if (isResettingPassword) return;

    setIsResettingPassword(true);
    try {
      const { error } = await supabase.functions.invoke('admin-operations', {
        body: {
          action: 'resetPassword',
          userId: email,
        },
      });

      if (error) throw error;

      toast.success("Password reset email sent successfully");
    } catch (error) {
      console.error("Error sending password reset:", error);
      toast.error("Failed to send password reset email");
    } finally {
      setIsResettingPassword(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading users...</div>;
  }

  return (
    <>
      <UsersTable
        users={users}
        onDeleteUser={setUserToDelete}
        onResetPassword={handlePasswordReset}
        isResettingPassword={isResettingPassword}
      />

      <DeleteUserDialog
        isOpen={!!userToDelete}
        isDeleting={isDeleting}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};