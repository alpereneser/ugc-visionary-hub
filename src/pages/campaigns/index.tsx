import { Header } from "@/components/Header";
import { CampaignsList } from "@/components/campaigns/CampaignsList";

const CampaignsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <CampaignsList />
      </main>
    </div>
  );
};

export default CampaignsPage;