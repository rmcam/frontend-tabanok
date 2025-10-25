import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { LearningUnit } from "@/types/learning";

interface LearningUnitCardProps {
  unit: LearningUnit;
  index: number;
}

const getStatusStyles = (unit: LearningUnit) => {
  if (unit.isCompleted) {
    return {
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500",
      iconColor: "text-green-500",
      textColor: "text-green-500",
      progressColor: "bg-green-500",
      timelineDot: "bg-green-500 border-green-700",
    };
  }
  if (unit.isLocked) {
    return {
      bgColor: "bg-gray-500/10",
      borderColor: "border-gray-700",
      iconColor: "text-gray-500",
      textColor: "text-gray-500",
      progressColor: "bg-gray-500",
      timelineDot: "bg-gray-500 border-gray-700",
    };
  }
  return {
    bgColor: "bg-primary/10",
    borderColor: "border-primary",
    iconColor: "text-primary",
    textColor: "text-primary",
    progressColor: "bg-primary",
    timelineDot: "bg-primary border-primary-foreground",
  };
};

const StatusIcon = ({ unit }: { unit: LearningUnit }) => {
  const styles = getStatusStyles(unit);
  if (unit.isCompleted) {
    return <CheckCircle className={cn("h-5 w-5", styles.iconColor)} />;
  }
  if (unit.isLocked) {
    return <Lock className={cn("h-5 w-5", styles.iconColor)} />;
  }
  return <PlayCircle className={cn("h-5 w-5", styles.iconColor)} />;
};

const LearningUnitCard: React.FC<LearningUnitCardProps> = memo(
  ({ unit, index }) => {
    const { t } = useTranslation();
    const isEven = index % 2 === 0;
    const styles = getStatusStyles(unit);

    const cardContent = (
      <div
        className={cn(
          "p-4 border rounded-lg shadow-lg bg-card transition-all duration-300 ease-in-out",
          "hover:shadow-xl hover:scale-[1.02]",
          styles.borderColor,
          styles.bgColor,
          {
            "opacity-60 cursor-not-allowed hover:scale-100": unit.isLocked,
          }
        )}
      >
        <div className="flex flex-col lg:flex-row items-start space-x-4 relative">
          <div className="absolute top-2 -right-3">
            <StatusIcon unit={unit} />
          </div>
          <div
            className={cn(
              "flex-shrink-0 flex items-center justify-center mb-2 lg:mb-0 p-3 border rounded-full shadow-md w-16 h-16",
              styles.bgColor,
              styles.borderColor
            )}
          >
            <span className="text-3xl">{unit.icon || "📖"}</span>
          </div>

          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <p className="font-bold text-xl md:pr-10">{unit.title}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
              {unit.description}
            </p>
          </div>
        </div>
        {unit.progress}
        {unit.progress !== undefined && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span
                className="text-xs font-semibold"
                style={{ color: styles.textColor }}
              >
                {t("progreso")}
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: styles.textColor }}
              >
                {unit.progress}%
              </span>
            </div>
            <Progress
              value={unit.progress}
              className="h-2"
              indicatorClassName={styles.progressColor}
            />
          </div>
        )}
      </div>
    );

    return (
      <div
        className={`relative flex items-center ${
          isEven ? "justify-start" : "justify-end"
        }`}
      >
        <div className={`w-5/12 ${isEven ? "order-1" : "order-3"}`}>
          {unit.isLocked ? (
            <div className="cursor-not-allowed">{cardContent}</div>
          ) : (
            <Link
              to={
                unit.lessons && unit.lessons.length > 0
                  ? `/learn/lesson/${unit.lessons[0].id}`
                  : unit.url
              }
            >
              {cardContent}
            </Link>
          )}
        </div>
        {/* Conector a la línea del tiempo */}
        <div className={`order-2 w-1/12 flex justify-center`}>
          <div
            className={cn(
              "w-4 h-4 rounded-full border-2 z-10",
              styles.timelineDot
            )}
          ></div>
        </div>
      </div>
    );
  }
);

export default LearningUnitCard;
