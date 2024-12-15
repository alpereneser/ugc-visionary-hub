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

      if (error) {
        toast.error("Kullanıcılar yüklenirken hata oluştu");
        throw error;
      }
      return data;
    },
  });

  const handleDelete = async () => {
    if (!userToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('admin-operations', {
        body: {
          action: 'deleteUser',
          userId: userToDelete,
        },
      });

      if (error) throw error;

      toast.success("Kullanıcı başarıyla silindi");
      refetch();
    } catch (error) {
      console.error("Kullanıcı silinirken hata:", error);
      toast.error("Kullanıcı silinemedi. Lütfen tekrar deneyin.");
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

      toast.success("Şifre sıfırlama e-postası gönderildi");
    } catch (error) {
      console.error("Şifre sıfırlama hatası:", error);
      toast.error("Şifre sıfırlama e-postası gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Kullanıcılar yükleniyor...</div>;
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