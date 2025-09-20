import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import type { FunFactContentData } from '@/types/learning';

interface LearningFunFactProps {
  funFact: FunFactContentData;
}

const LearningFunFact: React.FC<LearningFunFactProps> = ({ funFact }) => {
  const { t } = useTranslation();

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-l-4 border-yellow-500">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-yellow-700 flex items-center">
          <Lightbulb className="h-6 w-6 mr-2" /> {t("Dato Curioso")}
        </CardTitle>
        <CardDescription>{t("Aprende algo interesante sobre la cultura Kamentsá.")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg text-foreground">{funFact.fact}</p>
        {funFact.imageUrl && (
          <div className="mt-4 flex justify-center">
            <img src={funFact.imageUrl} alt={t("Imagen de dato curioso")} className="max-h-64 w-auto object-contain rounded-md shadow-md" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningFunFact;
