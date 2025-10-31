import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Volume2, Mic, StopCircle, RefreshCw } from 'lucide-react';
import type { AudioPronunciationContent } from '@/types/learning/learning.d';
import type { AudioPronunciationDetails, SubmitExerciseResponse } from '@/types/progress/progress.d';
import { useHeartsStore } from '@/stores/heartsStore';
import { useSubmitExerciseProgress } from '@/hooks/progress/progress.hooks'; // Importar useSubmitExerciseProgress

interface LearningAudioPronunciationProps {
  exerciseId: string;
  audioPronunciation: AudioPronunciationContent;
  onComplete?: (isCorrect: boolean, awardedPoints?: number) => void;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

const LearningAudioPronunciation: React.FC<LearningAudioPronunciationProps> = ({ exerciseId, audioPronunciation, onComplete, isSubmitting, setIsSubmitting }) => { // Aceptar exerciseId
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [submissionResponse, setSubmissionResponse] = useState<SubmitExerciseResponse | null>(null); // Nuevo estado para la respuesta


  const { decrementHeart } = useHeartsStore();
  const { mutate: submitExerciseProgressMutation, isPending: isSubmittingHook } = useSubmitExerciseProgress();

  const handlePlayAudio = () => {
    if (audioPronunciation.audioUrl) {
      const audio = new Audio(audioPronunciation.audioUrl);
      audio.play();
    } else {
      toast.error(t("URL de audio no disponible."));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop()); // Detener la pista de audio
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.info(t("Grabando..."));
    } catch (err) {
      console.error('Error al acceder al micrófono:', err);
      toast.error(t("No se pudo acceder al micrófono. Asegúrate de dar permisos."));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success(t("Grabación finalizada."));
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      toast.error(t("Por favor, graba tu pronunciación antes de enviar."));
      return;
    }

    setIsSubmitting(true); // Indicar que el envío ha comenzado

    // En un escenario real, aquí enviarías el audioBlob al backend para su evaluación.
    // Por ahora, simularemos una respuesta.
    // El backend debería tener un endpoint que reciba el archivo de audio y la frase esperada,
    // En un escenario real, aquí enviarías el audioBlob al backend para su evaluación.
    // Esto requeriría un endpoint de backend que reciba el archivo de audio y la frase esperada,
    // y use un modelo de reconocimiento de voz para evaluar la pronunciación.
    // Por ahora, el `userAnswer` será un placeholder.

    const submission = {
      userAnswer: {
        audioSubmitted: true,
        // En un futuro, aquí se podría enviar la transcripción del frontend si se usa un modelo local
        // o la URL de un audio subido a un servicio de almacenamiento.
        transcription: "simulated transcription" // Placeholder
      }
    };

    submitExerciseProgressMutation({
      exerciseId: exerciseId,
      answers: submission.userAnswer, // Asegurarse de que `answers` sea un objeto
    }, {
      onSuccess: (response) => {
        setSubmissionResponse(response); // Guardar la respuesta completa directamente
        const correct = response?.isCorrect; // Acceder directamente a isCorrect
        setIsCorrect(correct ?? false);
        setIsSubmitted(true);
        if (correct) {
          toast.success(t("¡Pronunciación correcta! Has ganado {{points}} puntos.", { points: response?.score })); // Usar response?.score
        } else {
          toast.error(t("Pronunciación incorrecta. Inténtalo de nuevo."));
          decrementHeart();
        }
        onComplete?.(correct ?? false, response?.score); // Usar response?.score
      },
      onError: (error) => {
        console.error('Error al enviar pronunciación:', error);
        toast.error(t("Error al enviar pronunciación."));
        setIsCorrect(false);
        setIsSubmitted(true);
        decrementHeart();
        onComplete?.(false);
      },
      onSettled: () => {
        // setIsSubmitting(false); // Esto se maneja en ExerciseModal
      },
    });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setIsCorrect(null);
    setIsRecording(false);
    setAudioBlob(null);
    audioChunksRef.current = [];
    mediaRecorderRef.current = null;
    setIsSubmitting(false); // Resetear el estado de envío en el padre también
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">{t("Pronunciación de Audio")}</CardTitle>
        <CardDescription>{t("Escucha la frase y graba tu pronunciación.")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {audioPronunciation.text && audioPronunciation.audioUrl ? (
          <div className="flex items-center justify-center p-4 border rounded-md bg-muted">
            <Button onClick={handlePlayAudio} variant="outline" size="icon" className="mr-4" aria-label={t("Reproducir audio de la frase: {{phrase}}", { phrase: audioPronunciation.text })}>
              <Volume2 className="h-6 w-6" />
            </Button>
            <p className="text-xl font-semibold text-foreground">{audioPronunciation.text}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">{t("Contenido de audio no disponible.")}</p>
        )}

        <div className="flex justify-center items-center space-x-4">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isSubmitted || isSubmitting}
            className={isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
            aria-label={isRecording ? t("Detener grabación") : t("Grabar pronunciación")}
          >
            {isRecording ? <StopCircle className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
            {isRecording ? t("Detener Grabación") : t("Grabar Pronunciación")}
          </Button>
          {audioBlob && !isRecording && (
            <audio controls src={URL.createObjectURL(audioBlob)} className="w-48" aria-label={t("Tu grabación de pronunciación")} />
          )}
        </div>

        {isSubmitted && isCorrect !== null && (
          <div
            className={`mt-6 p-4 rounded-md flex flex-col items-center justify-center space-y-2 transition-all duration-300 ease-in-out transform ${isCorrect ? 'bg-green-100 text-green-700 scale-105' : 'bg-red-100 text-red-700 scale-105'}`}
            role="status"
            aria-live="polite"
          >
            {isCorrect ? (
              <CheckCircle2 className="h-10 w-10 text-green-600 animate-bounce" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600 animate-shake" />
            )}
            <p className="text-xl font-bold">
              {isCorrect ? t("¡Pronunciación Correcta!") : t("Pronunciación Incorrecta.")}
            </p>
            {!isCorrect && submissionResponse?.details && 'expectedPhrase' in submissionResponse.details && (
              <p className="text-md text-center">
                {t("La frase esperada era:")} <span className="font-semibold">{(submissionResponse.details as AudioPronunciationDetails).expectedPhrase}</span>
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={isSubmittingHook || isRecording}>
          <RefreshCw className="h-4 w-4 mr-2" /> {t("Reiniciar")}
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmittingHook || isSubmitted || isRecording || !audioBlob}>
          {isSubmittingHook ? t("Enviando...") : t("Enviar Pronunciación")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningAudioPronunciation;
