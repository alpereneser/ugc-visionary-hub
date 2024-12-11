import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

interface ReviewCardProps {
  name: string;
  role: string;
  review: string;
  delay: number;
}

export const ReviewCard = ({ name, role, review, delay }: ReviewCardProps) => {
  return (
    <Card className={`w-[280px] p-6 bg-white/10 backdrop-blur-lg border-none transform hover:scale-105 transition-all duration-300 animate-fade-in opacity-0`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-blue-500/20">
          <User className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-left">
          <h4 className="font-semibold text-white">{name}</h4>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
      <p className="text-sm text-gray-300 text-left">{review}</p>
    </Card>
  );
};