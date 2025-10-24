import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { LearningModule } from "@/types/learning";
import { Lock, CheckCircle2, PlayCircle } from "lucide-react";

interface ModuleCardProps {
  module: LearningModule;
  index: number;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, index }) => {
  const { t } = useTranslation();
  const isLocked = module.isLocked; // Asumiendo que el backend proporciona isLocked

  return (
    <div className="relative flex items-center justify-center mb-12">
      {/* Círculo de progreso/estado */}
      <div className="absolute -left-6 md:-left-10 z-10">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center 
          ${
            module.isCompleted
              ? "bg-green-500"
              : isLocked
              ? "bg-gray-400"
              : "bg-primary"
          } 
          text-white shadow-lg ring-4 ring-background`}
        >
          {module.isCompleted ? (
            <CheckCircle2 className="h-7 w-7" />
          ) : isLocked ? (
            <Lock className="h-7 w-7" />
          ) : (
            <span className="text-xl font-bold">{index + 1}</span>
          )}
        </div>
      </div>

      <Card
        className={`w-full max-w-3xl mx-auto shadow-lg transition-all duration-300 
        ${
          isLocked
            ? "opacity-60 cursor-not-allowed"
            : "hover:shadow-xl hover:scale-[1.01]"
        } 
        ${module.isCompleted ? "border-green-500" : "border-primary/20"}`}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center">
            {module.name}
            {module.isCompleted && (
              <span className="ml-2 text-sm text-green-600">
                ({t("Completado")})
              </span>
            )}
          </CardTitle>
          <CardDescription>{module.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {t("Puntos del Módulo")}:{" "}
              <span className="font-semibold text-primary">
                {module.points}
              </span>
            </span>
            <span>
              {t("Progreso")}:{" "}
              <span className="font-semibold text-primary">
                {module.progress}%
              </span>
            </span>
          </div>
          <Progress
            value={module.progress}
            className="w-full h-2"
          />

          <div className="flex justify-end">
            <Button
              asChild
              disabled={isLocked}
              className="text-lg py-3"
            >
              <Link to={module.url}>
                {isLocked ? t("Bloqueado") : t("Explorar Módulo")}
                {!isLocked && <PlayCircle className="ml-2 h-5 w-5" />}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleCard;
