import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Globe, Bell, Palette } from "lucide-react"; // Iconos
import { ModeToggle } from "@/components/common/mode-toggle"; // Importar ModeToggle

const SettingsPage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("es"); // Simula el idioma actual
  const [receiveLessonNotifications, setReceiveLessonNotifications] = useState(true);
  const [receiveAchievementNotifications, setReceiveAchievementNotifications] = useState(true);
  const [receiveMessageNotifications, setReceiveMessageNotifications] = useState(true);

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    console.log("Idioma cambiado a:", value);
    // Lógica para cambiar el idioma de la aplicación (i18n)
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Ajustes</h1>

      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" /> Preferencias Generales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="language-select">Idioma</Label>
            <Select onValueChange={handleLanguageChange} value={selectedLanguage}>
              <SelectTrigger className="w-[180px]">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Selecciona un idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">Inglés</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label>Tema de la Interfaz</Label>
            <ModeToggle /> {/* Componente ModeToggle ya existente */}
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Preferencias de Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="lessons-notifications">Notificaciones de Lecciones</Label>
            <Switch
              id="lessons-notifications"
              checked={receiveLessonNotifications}
              onCheckedChange={setReceiveLessonNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="achievements-notifications">Notificaciones de Logros</Label>
            <Switch
              id="achievements-notifications"
              checked={receiveAchievementNotifications}
              onCheckedChange={setReceiveAchievementNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="messages-notifications">Notificaciones de Mensajes</Label>
            <Switch
              id="messages-notifications"
              checked={receiveMessageNotifications}
              onCheckedChange={setReceiveMessageNotifications}
            />
          </div>
          {/* En una implementación real, se añadiría un botón para guardar estos cambios */}
          {/* <Button onClick={handleSaveNotificationSettings} className="w-full mt-4">Guardar Preferencias</Button> */}
        </CardContent>
      </Card>

      {/* Aquí se podrían añadir otras secciones como "Privacidad" o "Accesibilidad" */}
    </div>
  );
};

export default SettingsPage;
