import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"; // Importar Link
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pencil, Save, XCircle } from "lucide-react"; // Iconos para editar, guardar, cancelar
import { useProfile, useUpdateProfile } from '@/hooks/auth/auth.hooks';
import { useUserById } from '@/hooks/users/users.hooks';
import { useUploadFile } from '@/hooks/upload/upload.hooks'; // Importar useUploadFile
import { toast } from 'sonner';
import type { UserProfile, UpdateProfileDto } from '@/types/api';
import { useUserStore } from '@/stores/userStore'; // Importar useUserStore

const ProfilePage: React.FC = () => {
  const { data: authProfile, isLoading: isLoadingAuth, error: authError } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadFileMutation = useUploadFile(); // Usar el hook de subida de archivos
  const setUser = useUserStore((state) => state.setUser); // Obtener la función setUser del store

  const { data: fullUserProfile, isLoading: isLoadingFullUser, error: fullUserError } = useUserById(authProfile?.id || '');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({}); // Usar Partial<UserProfile> para formData
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Cargar datos del perfil completo del usuario cuando estén disponibles
  useEffect(() => {
    if (fullUserProfile) {
      setFormData({
        id: fullUserProfile.id,
        firstName: fullUserProfile.firstName,
        lastName: fullUserProfile.lastName,
        email: fullUserProfile.email,
        username: fullUserProfile.username,
        languages: fullUserProfile.languages,
        preferences: fullUserProfile.preferences,
        culturalPoints: fullUserProfile.culturalPoints,
        level: fullUserProfile.level,
        points: fullUserProfile.points,
        gameStats: fullUserProfile.gameStats,
        dateOfBirth: fullUserProfile.dateOfBirth,
        country: fullUserProfile.country,
        city: fullUserProfile.city,
        lastLoginAt: fullUserProfile.lastLoginAt,
        createdAt: fullUserProfile.createdAt,
        avatarUrl: fullUserProfile.avatarUrl,
      } as Partial<UserProfile>); // Asegurar el tipo
      setUser(fullUserProfile); // Actualizar el store de usuario al cargar el perfil
    }
  }, [fullUserProfile, setUser]);

  // Manejar errores al cargar el perfil
  useEffect(() => {
    if (authError) {
      console.error('Error al cargar el perfil de autenticación:', authError);
      toast.error(`Error al cargar el perfil: ${authError.statusCode} - ${authError.message}`);
    }
    if (fullUserError) {
      console.error('Error al cargar el perfil completo del usuario:', fullUserError);
      toast.error(`Error al cargar el perfil completo: ${fullUserError.statusCode} - ${fullUserError.message}`);
    }
  }, [authError, fullUserError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file)); // Mostrar vista previa inmediatamente

      try {
        const uploadedFile = await uploadFileMutation.mutateAsync(file);
        // Una vez subido, actualizar el formData con el nuevo ID del avatar y filePath
        const updatedFormData = { ...formData, avatarId: uploadedFile.id, avatarUrl: uploadedFile.filePath };
        setFormData(updatedFormData); // Guardar ambos si es necesario
        toast.success('Avatar subido y perfil actualizado con la nueva URL.');
        // Actualizar el store de usuario con el nuevo avatar
        if (fullUserProfile) {
          setUser({ ...fullUserProfile, avatarId: uploadedFile.id, avatarUrl: uploadedFile.filePath });
        }
      } catch (error: any) {
        console.error('Error al subir el avatar:', error);
        toast.error(`Error al subir el avatar: ${error.message || 'Error desconocido'}`);
        setAvatarPreview(null);
      }
    }
  };

  const handleSave = async () => {
    if (!authProfile?.id) {
      toast.error('No se pudo obtener el ID del usuario.');
      return;
    }

    try {
      const dataToUpdate: UpdateProfileDto = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country ?? undefined,
        city: formData.city ?? undefined,
        avatarId: formData.avatarId ?? undefined, // Incluir avatarId
      };

      // Filtrar campos undefined para no enviar valores nulos si no se modificaron
      const filteredDataToUpdate = Object.fromEntries(
        Object.entries(dataToUpdate).filter(([_, value]) => value !== undefined)
      ) as UpdateProfileDto;

      await updateProfileMutation.mutateAsync(filteredDataToUpdate);
      setIsEditing(false);
      setAvatarPreview(null);
      // Después de guardar, actualizar el store de usuario con los datos más recientes
      if (fullUserProfile) {
        setUser({ ...fullUserProfile, ...filteredDataToUpdate });
      }
    } catch (updateError) {
      console.error('Error al guardar cambios del perfil:', updateError);
    }
  };

  const handleCancel = () => {
    // Revertir a los datos cargados del backend
    if (fullUserProfile) {
      setFormData({
        id: fullUserProfile.id,
        firstName: fullUserProfile.firstName,
        lastName: fullUserProfile.lastName,
        email: fullUserProfile.email,
        username: fullUserProfile.username,
        languages: fullUserProfile.languages,
        preferences: fullUserProfile.preferences,
        culturalPoints: fullUserProfile.culturalPoints,
        level: fullUserProfile.level,
        points: fullUserProfile.points,
        gameStats: fullUserProfile.gameStats,
        dateOfBirth: fullUserProfile.dateOfBirth,
        country: fullUserProfile.country,
        city: fullUserProfile.city,
        avatarId: fullUserProfile.avatarId, // Revertir también el avatarId
        avatarUrl: fullUserProfile.avatarUrl, // Revertir también el avatarUrl
      } as Partial<UserProfile>);
    }
    setIsEditing(false);
    setAvatarPreview(null);
  };

  // Verificar isLoading y si fullUserProfile existe
  if (isLoadingAuth || isLoadingFullUser) {
    return <div className="p-4 sm:p-6 lg:p-8 text-center">Cargando perfil...</div>;
  }

  // Verificar si hay error o si fullUserProfile no existe
  if (authError || fullUserError || !fullUserProfile) {
    return <div className="p-4 sm:p-6 lg:p-8 text-center text-red-500">Error al cargar el perfil o usuario no encontrado.</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Información Personal</CardTitle>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel} disabled={updateProfileMutation.isPending}>
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                {updateProfileMutation.isPending ? null : <Save className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            <Avatar className="h-24 w-24 mb-4">
            <AvatarImage
                src={avatarPreview || (formData.avatarId ? `${import.meta.env.VITE_API_URL}/multimedia/${formData.avatarId}/file` : undefined) || (fullUserProfile?.firstName && fullUserProfile?.lastName ? `https://ui-avatars.com/api/?name=${fullUserProfile.firstName}+${fullUserProfile.lastName}&background=random&color=fff` : undefined)}
                alt={`${formData.firstName || ''} ${formData.lastName || ''}`}
              />
              <AvatarFallback>{`${formData.firstName?.charAt(0) || ''}${formData.lastName?.charAt(0) || ''}`}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <Label htmlFor="avatar" className="cursor-pointer text-primary hover:underline">
                Cambiar foto de perfil
                <Input id="avatar" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </Label>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                value={formData.firstName || ''}
                onChange={handleInputChange}
                readOnly={!isEditing || updateProfileMutation.isPending}
                className={!isEditing ? "bg-muted/30" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                value={formData.lastName || ''}
                onChange={handleInputChange}
                readOnly={!isEditing || updateProfileMutation.isPending}
                className={!isEditing ? "bg-muted/30" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input
                id="username"
                value={formData.username || ''}
                onChange={handleInputChange}
                readOnly={!isEditing || updateProfileMutation.isPending}
                className={!isEditing ? "bg-muted/30" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                readOnly={true} // El email no es actualizable a través de este DTO
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Nivel</Label>
              <Input
                id="level"
                value={formData.level !== undefined ? formData.level.toString() : ''}
                readOnly={true}
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Puntos</Label>
              <Input
                id="points"
                value={formData.points !== undefined ? formData.points.toString() : ''}
                readOnly={true}
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="culturalPoints">Puntos Culturales</Label>
              <Input
                id="culturalPoints"
                value={formData.culturalPoints !== undefined ? formData.culturalPoints.toString() : ''}
                readOnly={true}
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={formData.country || ''}
                onChange={handleInputChange}
                readOnly={!isEditing || updateProfileMutation.isPending}
                className={!isEditing ? "bg-muted/30" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={handleInputChange}
                readOnly={!isEditing || updateProfileMutation.isPending}
                className={!isEditing ? "bg-muted/30" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="languages">Idiomas</Label>
              <Input
                id="languages"
                value={formData.languages?.join(', ') || ''}
                readOnly={true}
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastLoginAt">Último Inicio de Sesión</Label>
              <Input
                id="lastLoginAt"
                value={formData.lastLoginAt ? new Date(formData.lastLoginAt).toLocaleString() : ''}
                readOnly={true}
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="createdAt">Miembro Desde</Label>
              <Input
                id="createdAt"
                value={formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : ''}
                readOnly={true}
                className="bg-muted/30"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <p className="text-center text-muted-foreground">
        Para cambiar tu contraseña o configurar opciones de seguridad, visita la sección de <Link to="/settings/security" className="text-primary hover:underline">Seguridad</Link>.
      </p>
    </div>
  );
};

export default ProfilePage;
