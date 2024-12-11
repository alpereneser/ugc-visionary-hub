import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";

export const AdminActions = () => {
  const session = useSession();
  const navigate = useNavigate();
  const isAdmin = session?.user?.email === "alperen@tracefluence.com";

  if (!isAdmin) return null;

  return (
    <Button
      onClick={() => navigate("/admin")}
      className="flex items-center gap-2"
    >
      <LayoutDashboard className="w-4 h-4" />
      Admin Panel
    </Button>
  );
};