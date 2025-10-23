import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Volume2, Mic, StopCircle, RefreshCw } from 'lucide-react';
import type { AudioPronunciationContentData } from '@/types/learning';
import { useSubmitExercise } from '@/hooks/exercises/exercises.hooks'; // Corregir importación
import { useHeartsStore } from '@/stores/heartsStore';

interface LearningAudioPronunciationProps {
  exerciseId: string; // Añadir exerciseId como prop
  audioPronunciation: AudioPronunciationContentData;
  onComplete?: (isCorrect: boolean, awardedPoints?: number) => void;
}

const LearningAudioPronunciation: React.FC<LearningAudioPronunciationProps> = ({ exerciseId, audioPronunciation, onComplete }) => { // Aceptar exerciseId
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [submissionResponse, setSubmissionResponse] = useState<any>(null); // Nuevo estado para la respuesta

  const { decrementHeart } = useHeartsStore();
  const { mutate: submitExerciseMutation, isPending: isSubmitting } = useSubmitExercise();

  const handlePlayAudio = () => {
    const audio = new Audio(audioPronunciation.audioUrl);
    audio.play();
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

    submitExerciseMutation({
      id: exerciseId, // Usar la prop exerciseId
      submission: submission,
    }, {
      onSuccess: (response) => {
        setSubmissionResponse(response); // Guardar la respuesta completa
        const correct = response.isCorrect;
        setIsCorrect(correct);
        setIsSubmitted(true);
        if (correct) {
          toast.success(t("¡Pronunciación correcta! Has ganado {{points}} puntos.", { points: response.awardedPoints }));
        } else {
          toast.error(t("Pronunciación incorrecta. Inténtalo de nuevo."));
          decrementHeart();
        }
        onComplete?.(correct, response.awardedPoints);
      },
      onError: (error) => {
        console.error('Error al enviar pronunciación:', error);
        toast.error(t("Error al enviar pronunciación."));
        setIsCorrect(false);
        setIsSubmitted(true);
        decrementHeart();
        onComplete?.(false);
      }
    });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setIsCorrect(null);
    setIsRecording(false);
    setAudioBlob(null);
    audioChunksRef.current = [];
    mediaRecorderRef.current = null;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">{t("Pronunciación de Audio")}</CardTitle>
        <CardDescription>{t("Escucha la frase y graba tu pronunciación.")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center p-4 border rounded-md bg-muted">
          <Button onClick={handlePlayAudio} variant="outline" size="icon" className="mr-4" aria-label={t("Reproducir audio de la frase: {{phrase}}", { phrase: audioPronunciation.phrase })}>
            <Volume2 className="h-6 w-6" />
          </Button>
          <p className="text-xl font-semibold text-foreground">{audioPronunciation.phrase}</p>
        </div>

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
            {!isCorrect && submissionResponse?.details && submissionResponse.details.expectedPhrase && (
              <p className="text-md text-center">
                {t("La frase esperada era:")} <span className="font-semibold">{submissionResponse.details.expectedPhrase}</span>
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={isSubmitting || isRecording}>
          <RefreshCw className="h-4 w-4 mr-2" /> {t("Reiniciar")}
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || isSubmitted || isRecording || !audioBlob}>
          {isSubmitting ? t("Enviando...") : t("Enviar Pronunciación")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningAudioPronunciation;
