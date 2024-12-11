import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  link: string;
}

export const StatsCard = ({ title, value, icon: Icon, link }: StatsCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card
      className="hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200/50 bg-white"
      onClick={() => navigate(link)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <h2 className="text-2xl font-bold">{value}</h2>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};