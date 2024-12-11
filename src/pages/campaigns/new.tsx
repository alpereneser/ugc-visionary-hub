import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { MainLayout } from "@/components/layouts/MainLayout";

const NewCampaign = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold">Create New Campaign</h1>
          </div>

          <CampaignForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default NewCampaign;