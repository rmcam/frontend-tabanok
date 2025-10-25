import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface LessonCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  lessonTitle: string;
}

const LessonCompletionDialog: React.FC<LessonCompletionDialogProps> = ({
  isOpen,
  onClose,
  onContinue,
  lessonTitle,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      {isOpen && (
        <Confetti
          recycle={false}
          numberOfPieces={500}
          tweenDuration={5000}
        />
      )}
      <DialogContent className="sm:max-w-[425px] p-6 text-center">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mx-auto mb-4 text-green-500"
          >
            <CheckCircle2 className="h-20 w-20" />
          </motion.div>
          <DialogTitle className="text-3xl font-bold text-primary">
            {t("¡Lección Completada!")}
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground mt-2">
            {t("Has terminado la lección")}{" "}
            <span className="font-semibold text-secondary-foreground">
              {lessonTitle}
            </span>
            . ¡Felicidades!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-6">
          <Button
            onClick={onContinue}
            className="w-full"
          >
            {t("Continuar Aprendiendo")}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            {t("Cerrar")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LessonCompletionDialog;
