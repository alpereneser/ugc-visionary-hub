import { ChartBar, Users, DollarSign, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Features = () => {
  const features = [
    {
      icon: Users,
      title: "Creator Management",
      description: "Track and manage your UGC creators in one place. Monitor performance and engagement metrics."
    },
    {
      icon: Calendar,
      title: "Campaign Planning",
      description: "Plan and schedule your UGC campaigns with an intuitive calendar interface."
    },
    {
      icon: DollarSign,
      title: "ROI Tracking",
      description: "Monitor campaign costs and returns with detailed financial analytics."
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Get detailed insights into campaign performance and creator impact."
    },
    {
      icon: BarChart3,
      title: "Content Impact",
      description: "Measure the impact of UGC content across different platforms and campaigns."
    },
    {
      icon: ChartBar,
      title: "Brand Growth",
      description: "Track your brand's growth through UGC campaigns and creator partnerships."
    }
  ];

  return (
    <div className="py-24 px-4 bg-gradient-to-b from-black to-blue-900 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Amplify Your Brand with UGC
        </h2>
        <p className="text-xl text-center text-gray-300 mb-16 max-w-3xl mx-auto">
          Transform your content strategy with powerful creator management and campaign tracking tools
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-white/10 backdrop-blur-lg border-none hover:transform hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-blue-500/20 rounded-lg mb-4">
                  <feature.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};