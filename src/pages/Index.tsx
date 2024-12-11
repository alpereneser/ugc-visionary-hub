import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { MainLayout } from "@/components/layouts/MainLayout";

const Index = () => {
  return (
    <MainLayout showHeader={false}>
      <div className="pt-16">
        <Hero />
        <Features />
        <Pricing />
      </div>
    </MainLayout>
  );
};

export default Index;