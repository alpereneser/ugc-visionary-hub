import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, UserPlus, FileText } from "lucide-react";

export const UserActions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3">
      <Button
        onClick={() => navigate("/creators/new")}
        className="flex items-center gap-2"
        variant="outline"
      >
        <UserPlus className="w-4 h-4" />
        Add Creator
      </Button>
      <Button
        onClick={() => navigate("/products/new")}
        className="flex items-center gap-2"
        variant="outline"
      >
        <FileText className="w-4 h-4" />
        Add Content
      </Button>
      <Button
        onClick={() => navigate("/campaigns/new")}
        className="flex items-center gap-2"
        variant="outline"
      >
        <Plus className="w-4 h-4" />
        Add Campaign
      </Button>
    </div>
  );
};