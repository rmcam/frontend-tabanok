import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Lock, KeyRound, History } from "lucide-react"; // Iconos

const SecurityPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");

  const [is2FAEnabled, setIs2FAEnabled] = useState(false); // Simula el estado de 2FA
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFAMessage, setTwoFAMessage] = useState("");

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMessage("");
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeMessage("Las nuevas contraseñas no coinciden.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordChangeMessage("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    // Lógica simulada para cambiar contraseña
    console.log("Cambiando contraseña:", { currentPassword, newPassword });
    setPasswordChangeMessage("Contraseña cambiada exitosamente.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handle2FAToggle = () => {
    if (is2FAEnabled) {
      // Lógica para deshabilitar 2FA (requiere confirmación, ej. con AlertDialog)
      console.log("Deshabilitando 2FA");
      setIs2FAEnabled(false);
      setTwoFAMessage("Autenticación de dos factores deshabilitada.");
    } else {
      // Lógica para habilitar 2FA (mostrar QR, pedir código)
      console.log("Habilitando 2FA");
      setTwoFAMessage("Por favor, escanea el código QR con tu aplicación de autenticación y luego ingresa el código.");
      // Aquí se mostraría el QR real y se pediría el código de verificación
      setIs2FAEnabled(true); // Simulado, en real se habilitaría después de la verificación
    }
  };

  const handle2FACodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Verificando código 2FA:", twoFACode);
    // Lógica para verificar el código 2FA con el backend
    if (twoFACode === "123456") { // Código simulado
      setTwoFAMessage("2FA configurada exitosamente.");
      // setIs2FAEnabled(true); // Ya se habilitó en el toggle simulado
      setTwoFACode("");
    } else {
      setTwoFAMessage("Código 2FA incorrecto. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Seguridad de la Cuenta</h1>

      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" /> Cambiar Contraseña
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
            {passwordChangeMessage && (
              <Alert variant={passwordChangeMessage.includes("exitosamente") ? "default" : "destructive"}>
                <Terminal className="h-4 w-4" />
                <AlertTitle>{passwordChangeMessage.includes("exitosamente") ? "Éxito" : "Error"}</AlertTitle>
                <AlertDescription>{passwordChangeMessage}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">Guardar Nueva Contraseña</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" /> Autenticación de Dos Factores (2FA)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="2fa-switch">Estado de 2FA</Label>
            <Switch
              id="2fa-switch"
              checked={is2FAEnabled}
              onCheckedChange={handle2FAToggle}
            />
          </div>
          {is2FAEnabled && (
            <div className="space-y-4">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Configura tu 2FA</AlertTitle>
                <AlertDescription>
                  Escanea este código QR con tu aplicación de autenticación (ej. Google Authenticator) o ingresa la clave manualmente.
                  <div className="mt-4 flex justify-center">
                    {/* Placeholder para el código QR real */}
                    <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-muted-foreground">
                      Código QR
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-center">Clave: ABCD-EFGH-IJKL-MNOP</p>
                </AlertDescription>
              </Alert>
              <form onSubmit={handle2FACodeSubmit} className="space-y-2">
                <Label htmlFor="2fa-code">Código de Verificación</Label>
                <Input
                  id="2fa-code"
                  type="text"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                  placeholder="Ingresa el código de 6 dígitos"
                  maxLength={6}
                  required
                />
                <Button type="submit" className="w-full">Verificar y Activar</Button>
              </form>
            </div>
          )}
          {twoFAMessage && (
            <Alert variant={twoFAMessage.includes("exitosamente") ? "default" : "destructive"}>
              <Terminal className="h-4 w-4" />
              <AlertTitle>{twoFAMessage.includes("exitosamente") ? "Éxito" : "Error"}</AlertTitle>
              <AlertDescription>{twoFAMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Sección de Historial de Sesiones (Opcional) */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" /> Historial de Sesiones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aquí se mostraría un listado de tus sesiones activas y el historial de inicios de sesión.
            (Requiere integración con el backend para obtener estos datos).
          </p>
          {/* Ejemplo de tabla si se implementa */}
          {/*
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Fecha/Hora</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Chrome en Windows</TableCell>
                <TableCell>Bogotá, Colombia</TableCell>
                <TableCell>27/05/2025 17:45</TableCell>
                <TableCell>192.168.1.100</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          */}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityPage;
