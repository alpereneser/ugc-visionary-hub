import { ChartBar, Calendar, DollarSign } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export const Features = () => {
  return (
    <div className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Everything You Need to Track UGC Success
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            Icon={ChartBar}
            title="Performance Tracking"
            description="Monitor product placements, payments, and resulting sales or visits with detailed analytics"
          />
          <FeatureCard
            Icon={Calendar}
            title="Future Planning"
            description="Plan your upcoming campaigns with data-driven insights from past performance"
          />
          <FeatureCard
            Icon={DollarSign}
            title="ROI Analysis"
            description="Calculate and visualize your return on investment for each UGC campaign"
          />
        </div>
      </div>
    </div>
  );
};