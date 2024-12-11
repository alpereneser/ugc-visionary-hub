import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
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
        <Button
          onClick={() => navigate("/campaigns/new")}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Campaign
        </Button>
      </div>
    </div>
  );
};