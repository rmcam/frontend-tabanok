import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button'; // Importar Button
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Award, Gem, Heart, Zap } from 'lucide-react';
import { useProfile } from '@/hooks/auth/auth.hooks';
import { useCurrentLeaderboard, useAllAchievements, useAllMissionTemplates, useHeartRecharge } from '@/hooks/gamification/gamification.hooks'; // Importar hooks de gamificación
import type { LeaderboardRanking, GamificationUserStatsDto, Achievement, MissionTemplate } from '@/types/api'; // Importar tipos de la API
import AchievementCard from '../components/AchievementCard'; // Importar AchievementCard
import MissionCard from '../components/MissionCard'; // Importar MissionCard

const GamificationPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: userProfile, isLoading: isLoadingProfile } = useProfile();
  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useCurrentLeaderboard(); // Obtener el leaderboard
  const { data: achievements, isLoading: isLoadingAchievements } = useAllAchievements(); // Obtener todos los logros
  const { data: missionTemplates, isLoading: isLoadingMissionTemplates } = useAllMissionTemplates(); // Obtener todas las plantillas de misión
  const rechargeHeartsMutation = useHeartRecharge(); // Inicializar el hook de recarga de vidas

  if (isLoadingProfile || isLoadingLeaderboard || isLoadingAchievements || isLoadingMissionTemplates) {
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

  const userStats: GamificationUserStatsDto = userProfile.gameStats || {
    level: 1,
    points: 0,
    totalPoints: 0, // Asegurar que totalPoints esté inicializado
    streak: 0,
    hearts: 5,
    achievements: [],
    missions: [],
    league: 'Bronze',
  };

  const currentLevelProgress = (userStats.points % 1000) / 10; // Asumiendo 1000 puntos por nivel
  const nextLevelPoints = 1000 - (userStats.points % 1000);

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
            <div className="text-5xl font-bold text-primary">{userStats.totalPoints} XP</div>
            <p className="text-sm text-muted-foreground">{t("Nivel")}: {userStats.level}</p>
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
            <div className="text-5xl font-bold text-primary">{userStats.streak || 0} {t("días")}</div>
            <p className="text-sm text-muted-foreground">{t("Racha de aprendizaje")}</p>
            <div className="flex items-center mt-4">
              <Heart className="h-6 w-6 text-red-500 mr-2" />
              <span className="text-xl font-bold">{userStats.hearts} {t("Vidas")}</span>
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
            <div className="text-5xl font-bold text-primary">{userStats.league}</div>
            <p className="text-sm text-muted-foreground">{t("Compite semanalmente por el primer puesto.")}</p>
            <div className="flex items-center mt-4">
              <Gem className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-xl font-bold">{t("Tu Ranking")}: {leaderboard?.rankings.findIndex(r => r.userId === userProfile.id) + 1 || '-'}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t("La liga se actualiza cada lunes.")}
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
                  isEarned={userStats.achievements?.some(ua => ua.achievementId === achievement.id) || false}
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
                  userMission={userStats.missions?.find(um => um.missionTemplateId === mission.id)}
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
