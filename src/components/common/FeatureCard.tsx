import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  ariaLabel: string;
  className?: string;
}

const FeatureCard = ({ title, description, icon: Icon, iconColor, ariaLabel, className }: FeatureCardProps) => {
  return (
    <Card className={`bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      <CardContent className="p-6 flex flex-col items-center">
        <Icon className="h-10 w-10 mb-4" style={{ color: iconColor }} aria-label={ariaLabel} />
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-700 text-center text-lg">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
