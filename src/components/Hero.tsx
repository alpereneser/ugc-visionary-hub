import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-accent to-white">
      <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
        UGC Tracker
      </h1>
      <p className="text-xl md:text-2xl text-secondary mb-8 max-w-2xl animate-fade-in">
        Track your UGC campaigns, measure ROI, and plan your future content strategy - all in one place
      </p>
      <button className="bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors animate-fade-in">
        Get Started Now <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};