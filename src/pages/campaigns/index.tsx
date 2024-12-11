import { MainLayout } from "@/components/layouts/MainLayout";
import { CampaignsList } from "@/components/campaigns/CampaignsList";

const Campaigns = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Campaigns</h1>
        <CampaignsList />
      </div>
    </MainLayout>
  );
};

export default Campaigns;