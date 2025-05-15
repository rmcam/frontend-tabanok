import Loading from "@/components/common/Loading";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useFormValidation from "@/hooks/useFormValidation";
import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const SignInForm = () => {
  const { t } = useTranslation();
  const [loginError, setLoginError] = React.useState<string | null>(null); // Estado para el error de inicio de sesión

  const initialValues = {
    identifier: "",
    password: "",
  };

  const validationRules = React.useMemo(
    () => ({
      identifier: (value: string) => {
        if (!value) return t("auth.signin.validation.identifier.required");
        if (value.length < 6)
          return t("auth.signin.validation.identifier.minlength");
        return undefined;
      },
      password: (value: string) => {
        if (!value) return t("auth.signin.validation.password.required");
        if (value.length < 6)
          return t("auth.signin.validation.password.minlength");
        return undefined;
      },
    }),
    [t]
  );

  const { signingIn, signin } = useAuth();

  const { values, errors, isValid, handleChange, handleSubmit } =
    useFormValidation(initialValues);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
      <form
        onSubmit={async (event) => {
          const validationResult = handleSubmit(validationRules)(event);
          if (validationResult.isValid) {
            setLoginError(null); // Limpiar errores anteriores
            const signinData = {
              identifier: values.identifier,
              password: values.password,
            };
            try {
              await signin(signinData);
            } catch (error: unknown) {
              // Capturar el error propagado desde AuthProvider
              let errorMessage = t("auth.signin.error.generic"); // Mensaje genérico por defecto
              if (error instanceof Error) {
                try {
                  // Intentar parsear el mensaje de error si parece JSON
                  const errorData = JSON.parse(error.message);
                  if (errorData.message) {
                    errorMessage = errorData.message;
                  } else {
                    errorMessage = error.message; // Usar el mensaje original si no hay propiedad 'message'
                  }
                } catch {
                  // Si falla el parseo, usar el mensaje de error original
                  errorMessage = error.message;
                }
              }
              setLoginError(errorMessage); // Mostrar el mensaje de error procesado
            }
          } else {
            console.log("Formulario inválido. No se enviará la petición de inicio de sesión.");
          }
        }}
        className="w-full max-w-sm space-y-6"
      >
        <div className="grid gap-3">
          <Label htmlFor="identifier">{t("auth.signin.label.username")}</Label>
          <Input
            id="identifier"
            type="text"
            placeholder={t("auth.signin.placeholder.username")}
            name="identifier"
            value={values.identifier}
            onChange={handleChange}
            aria-invalid={!!errors.identifier}
            aria-describedby="identifier-error"
            className={cn(errors.identifier && "border-destructive")}
          />
          {errors.identifier && (
            <p id="identifier-error" className="text-destructive text-sm mt-1">
              {errors.identifier}
            </p>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">{t("auth.signin.label.password")}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t("auth.signin.placeholder.password")}
            name="password"
            value={values.password}
            onChange={handleChange}
            aria-invalid={!!errors.password}
            aria-describedby="password-error"
            className={cn(errors.password && "border-destructive")}
          />
          {errors.password && (
            <p id="password-error" className="text-destructive text-sm mt-1">
              {errors.password}
            </p>
          )}
          {loginError && ( // Mostrar error de inicio de sesión si existe
            <p className="text-destructive text-sm mt-1">
              {loginError}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={!isValid || signingIn}>
          {signingIn ? <Loading /> : t("auth.signin.button.signIn")}
        </Button>
        <Link to="/forgot-password" className="text-sm text-k-negro-500 hover:text-k-negro-700">
          {t("auth.signin.link.forgotPassword")}
        </Link>
      </form>
    </div>
  );
};

export default SignInForm;