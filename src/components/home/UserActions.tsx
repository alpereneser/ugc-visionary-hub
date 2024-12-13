import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const UserActions = () => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        onClick={() => navigate("/creators/new")}
        variant="outline"
        size="sm"
        className="flex-1 sm:flex-none"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Creator
      </Button>
      <Button
        onClick={() => navigate("/products/new")}
        variant="outline"
        size="sm"
        className="flex-1 sm:flex-none"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Content
      </Button>
      <Button
        onClick={() => navigate("/campaigns/new")}
        variant="outline"
        size="sm"
        className="flex-1 sm:flex-none"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Campaign
      </Button>
    </>
  );
};