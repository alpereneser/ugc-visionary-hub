import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { MainLayout } from "@/components/layouts/MainLayout";
import { HeroSlider } from "@/components/HeroSlider";

const Index = () => {
  return (
    <MainLayout showHeader={true}>
      <div>
        <Hero />
        <HeroSlider />
        <Features />
        <Pricing />
      </div>
    </MainLayout>
  );
};

export default Index;