import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export const UserActions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3">
      <Button
        onClick={() => navigate("/creators/new")}
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Creator
      </Button>
      <Button
        onClick={() => navigate("/products/new")}
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Content
      </Button>
    </div>
  );
};