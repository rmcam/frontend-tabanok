import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Award, Gem, Heart, Zap } from 'lucide-react';
import { useProfile } from '@/hooks/auth/auth.hooks';
import { useCurrentLeaderboard, useAllAchievements, useAllMissionTemplates, useHeartRecharge, useGamificationUserStats } from '@/hooks/gamification/gamification.hooks';
import type { LeaderboardRanking, GamificationUserStatsDto, Achievement, MissionTemplate, UserAchievementDto, UserMissionDto } from '@/types/gamification/gamification.d'; // Importar los tipos correctos
import AchievementCard from '../components/AchievementCard';
import MissionCard from '../components/MissionCard';
import { useSoundEffect } from '@/hooks/gamification/useSoundEffect';
import { useUserStore } from '@/stores/userStore';
import { useUserProgress } from '@/hooks/progress/progress.hooks'; // Importar el nuevo hook
import type { GetUserProgressFilters } from '@/types/progress/progress.d'; // Importar los filtros

const GamificationPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: userProfile, isLoading: isLoadingProfile } = useProfile();
  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useCurrentLeaderboard(); // Obtener el leaderboard
  const { data: achievements, isLoading: isLoadingAchievements } = useAllAchievements(); // Obtener todos los logros
  const { data: missionTemplates, isLoading: isLoadingMissionTemplates } = useAllMissionTemplates(); // Obtener todas las plantillas de misión
  const rechargeHeartsMutation = useHeartRecharge(); // Inicializar el hook de recarga de vidas
  const playSound = useSoundEffect(); // Inicializar el hook de sonido
  const { user } = useUserStore(); // Obtener el usuario del store
  const { data: userStats, isLoading: isLoadingUserStats } = useGamificationUserStats(user?.id || ''); // Obtener userStats aquí

  // Definir filtros para el progreso general del usuario
  const userProgressFilters: GetUserProgressFilters = {
    includeExercises: true,
    includeModules: true,
    limit: 1, // Solo necesitamos el totalItems para el conteo
  };

  const { data: userProgress, isLoading: isLoadingUserProgress } = useUserProgress(user?.id, userProgressFilters);

  // Efecto para detectar nuevos logros o misiones completadas
  useEffect(() => {
    if (userStats) {
      // Lógica para detectar nuevos logros
      // Esto requeriría comparar el estado actual con un estado anterior,
      // lo cual es más complejo y podría requerir un useRef o un estado local.
      // Por simplicidad, aquí solo se muestra la idea.
      // Por ejemplo, si el backend envía un evento o un campo 'newlyEarnedAchievementId'
      // se podría reproducir el sonido.

      // Para esta implementación, asumiremos que el sonido de "levelUp" es suficiente
      // para indicar un progreso significativo, y los sonidos de "correct" y "unlock"
      // ya se manejan en LearningPathNode.
    }
  }, [userStats, playSound]);


  if (isLoadingProfile || isLoadingLeaderboard || isLoadingAchievements || isLoadingMissionTemplates || isLoadingUserStats || isLoadingUserProgress) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-lg">{t("Cargando dashboard de gamificación...")}</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-red-500">
        <p className="text-lg">{t("No se pudo cargar el perfil del usuario.")}</p>
      </div>
    );
  }

  // userStats ya se obtiene del hook useGamificationUserStats
  const currentUserStats: GamificationUserStatsDto = userStats ?? {
    level: 1,
    points: 0,
    totalPoints: 0,
    streak: 0,
    hearts: 5,
    achievements: [],
    missions: [],
    league: 'Bronze',
    lastActivity: new Date().toISOString(), // Añadir lastActivity para cumplir con la interfaz
  };

  const currentLevelProgress = ((currentUserStats?.points ?? 0) % 1000) / 10; // Asumiendo 1000 puntos por nivel
  const nextLevelPoints = 1000 - ((currentUserStats?.points ?? 0) % 1000);

  return (
    <div className="flex flex-col flex-grow p-4 md:p-8 max-w-7xl mx-auto">
      <div className="text-center lg:text-left mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3 text-primary">
          {t("Tu Dashboard de Gamificación")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
          {t("Sigue tu progreso, compite en ligas y desbloquea logros.")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Tarjeta de Puntos y Nivel */}
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">{t("Puntos y Nivel")}</CardTitle>
            <Award className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-primary">{currentUserStats.totalPoints} XP</div>
            <p className="text-sm text-muted-foreground">{t("Nivel")}: {currentUserStats.level}</p>
            <Progress value={currentLevelProgress} className="w-full h-2 mt-4" />
            <p className="text-xs text-muted-foreground mt-2">
              {t("Faltan")} {nextLevelPoints} {t("XP para el siguiente nivel")}
            </p>
          </CardContent>
        </Card>

        {/* Tarjeta de Racha y Vidas */}
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">{t("Racha y Vidas")}</CardTitle>
            <Heart className="h-6 w-6 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-primary">{currentUserStats.streak || 0} {t("días")}</div>
            <p className="text-sm text-muted-foreground">{t("Racha de aprendizaje")}</p>
            <div className="flex items-center mt-4">
              <Heart className="h-6 w-6 text-red-500 mr-2" />
              <span className="text-xl font-bold">{currentUserStats.hearts} {t("Vidas")}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t("Las vidas se recargan con el tiempo o se pueden ganar.")}
            </p>
            {/* Botón de recarga de vidas (temporal para demostración) */}
            <Button
              onClick={() => rechargeHeartsMutation.mutate(userProfile.id)}
              disabled={rechargeHeartsMutation.isPending}
              className="mt-4 w-full"
            >
              {rechargeHeartsMutation.isPending ? t("Recargando...") : t("Recargar Vidas")}
            </Button>
          </CardContent>
        </Card>

        {/* Tarjeta de Liga Actual */}
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">{t("Liga Actual")}</CardTitle>
            <Trophy className="h-6 w-6 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-primary">{currentUserStats.league}</div>
            <p className="text-sm text-muted-foreground">{t("Compite semanalmente por el primer puesto.")}</p>
            <div className="flex items-center mt-4">
              <Gem className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-xl font-bold">{t("Tu Ranking")}: {(leaderboard?.rankings || []).findIndex(r => r.userId === userProfile.id) + 1 || '-'}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t("La liga se actualiza cada lunes.")}
            </p>
          </CardContent>
        </Card>

        {/* Nueva Tarjeta de Progreso General */}
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">{t("Progreso General")}</CardTitle>
            <Zap className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-primary">
              {userProgress?.totalItems ?? 0}
            </div>
            <p className="text-sm text-muted-foreground">{t("Elementos de aprendizaje completados")}</p>
            <Progress value={userProgress?.totalItems ? (userProgress.totalItems / 100) * 100 : 0} className="w-full h-2 mt-4" /> {/* Asumiendo un total de 100 elementos para un progreso simple */}
            <p className="text-xs text-muted-foreground mt-2">
              {t("Continúa aprendiendo para desbloquear más contenido.")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sección de Leaderboard */}
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">{t("Tabla de Clasificación Semanal")}</CardTitle>
          <CardDescription>{t("Compite con otros estudiantes y sube de rango.")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Rango")}</TableHead>
                <TableHead>{t("Usuario")}</TableHead>
                <TableHead className="text-right">{t("Puntos")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard?.rankings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    {t("No hay participantes en la tabla de clasificación aún.")}
                  </TableCell>
                </TableRow>
              ) : (
                leaderboard?.rankings.map((ranking, index) => (
                  <TableRow key={ranking.userId} className={ranking.userId === userProfile.id ? 'bg-primary/10' : ''}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={ranking.avatarUrl} alt={ranking.username} />
                          <AvatarFallback>{ranking.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {ranking.username}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{ranking.totalPoints}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sección de Logros */}
      <Card className="shadow-lg border-primary/20 mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">{t("Tus Logros")}</CardTitle>
          <CardDescription>{t("Desbloquea insignias por tus hitos de aprendizaje.")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements?.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground">
                {t("Aún no hay logros disponibles.")}
              </p>
            ) : (
              achievements?.map(achievement => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isEarned={currentUserStats.achievements?.some(ua => ua.achievementId === achievement.id) || false}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sección de Misiones */}
      <Card className="shadow-lg border-primary/20 mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">{t("Misiones Semanales")}</CardTitle>
          <CardDescription>{t("Completa misiones para ganar XP extra y recompensas.")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {missionTemplates?.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground">
                {t("Aún no hay misiones disponibles.")}
              </p>
            ) : (
              missionTemplates?.map(mission => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  userMission={currentUserStats.missions?.find(um => um.missionTemplateId === mission.id)}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationPage;
