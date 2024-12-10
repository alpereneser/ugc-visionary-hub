import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      className="hover:bg-accent/50 cursor-pointer transition-colors"
      onClick={() => navigate(link)}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};