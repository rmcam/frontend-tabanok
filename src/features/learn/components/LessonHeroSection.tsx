import React from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LearningLesson } from "@/types/learning";

interface LessonHeroSectionProps {
  lesson: LearningLesson;
}

const LessonHeroSection: React.FC<LessonHeroSectionProps> = ({ lesson }) => {
  const { t } = useTranslation();

  return (
    <Card className="shadow-lg border-primary/20 relative overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
      {/* Background visual element - could be an SVG pattern or image */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          fill="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <pattern
              id="pattern-circles"
              x="0"
              y="0"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="2"
                cy="2"
                r="1"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#pattern-circles)"
            className="text-purple-300"
          />
        </svg>
      </div>

      <CardHeader className="relative z-10">
        <CardTitle className="text-4xl font-extrabold text-white drop-shadow-md">
          {lesson.title}
        </CardTitle>
        <CardDescription className="text-purple-200 text-lg mt-2">
          {lesson.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10 space-y-4 pt-4">
        <div className="flex items-center justify-between text-lg text-purple-100">
          <span>
            {t("Puntos Requeridos")}:{" "}
            <span className="font-semibold text-white">
              {lesson.requiredPoints}
            </span>
          </span>
          <span>
            {t("Progreso de la Lección")}:{" "}
            <span className="font-extrabold text-white">
              {lesson.progress}%
            </span>
          </span>
        </div>
        <Progress
          value={lesson.progress}
          className="w-full h-3 bg-purple-700 [&>*]:bg-white"
        />
      </CardContent>
    </Card>
  );
};

export default LessonHeroSection;
