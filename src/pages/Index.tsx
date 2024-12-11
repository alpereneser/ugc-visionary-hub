import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { MainLayout } from "@/components/layouts/MainLayout";
import { HeroSlider } from "@/components/HeroSlider";
import { ArticlesSection } from "@/components/home/ArticlesSection";

const Index = () => {
  return (
    <MainLayout showHeader={true}>
      <div>
        <Hero />
        <HeroSlider />
        <Features />
        <div className="container mx-auto px-4 py-16">
          <ArticlesSection />
        </div>
        <Pricing />
      </div>
    </MainLayout>
  );
};

export default Index;