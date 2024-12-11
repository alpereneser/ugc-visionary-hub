import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HeroSlider } from "@/components/HeroSlider";
import { MainLayout } from "@/components/layouts/MainLayout";

const Index = () => {
  return (
    <MainLayout showHeader={false}>
      <div className="bg-black min-h-screen">
        <Hero />
        <HeroSlider />
        <Features />
      </div>
    </MainLayout>
  );
};

export default Index;