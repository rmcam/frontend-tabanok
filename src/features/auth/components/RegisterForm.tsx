import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Importar useNavigate y useLocation
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form'; // Añadir Controller
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useSignUp } from '@/hooks/auth/auth.hooks'; // Importar useSignUp
import type { ApiError, LoginResponse, ApiResponse, UserRole } from '@/types/api'; // Importar ApiError, LoginResponse, ApiResponse y UserRole como tipo
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Importar Select
import { Switch } from '@/components/ui/switch'; // Importar Switch
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next'; // Importar useTranslation

type AuthView = 'login' | 'register' | 'forgotPassword' | 'resetPassword';

interface RegisterFormProps {
  changeView: (view: AuthView) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ changeView }) => {
  const { t } = useTranslation(); // Inicializar useTranslation
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RegisterFormData>>({
    languages: [],
    preferences: {
      notifications: false,
      language: 'es',
      theme: 'system',
    },
    role: 'student',
  });

  const registerSchema = z.object({
    email: z.string().email(t('email_invalid')),
    password: z.string().min(6, t('password_min_length')),
    confirmPassword: z.string().min(6, t('password_min_length')),
    username: z.string().min(3, t('username_min_length')),
    firstName: z.string().min(1, t('first_name_required')),
    secondName: z.string().optional(),
    firstLastName: z.string().min(1, t('first_last_name_required')),
    secondLastName: z.string().optional(),
    languages: z.array(z.string()).min(1, t('select_at_least_one_language')),
    preferences: z.object({
      notifications: z.boolean(),
      language: z.enum(['es', 'en', 'kmt'], { message: t('preferred_language_required') }),
      theme: z.enum(['light', 'dark', 'system'], { message: t('preferred_theme_required') }),
    }),
    role: z.literal('student').optional(), // El rol será 'student' por defecto y opcional
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('passwords_do_not_match'),
    path: ['confirmPassword'],
  });

  type RegisterFormData = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger, // Añadir trigger para validación manual
    getValues, // Añadir getValues para obtener los valores del formulario
    setValue, // Añadir setValue para actualizar valores programáticamente
    watch, // Añadir watch para observar cambios en los campos
    control, // Añadir control para Controller
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: formData as RegisterFormData, // Usar formData como valores por defecto, casteado
  });

  const watchedLanguages = watch('languages', []); // Observar el array de idiomas

  // Definir los campos para cada paso
  const stepFields: Record<number, (keyof RegisterFormData)[]> = {
    1: ['email', 'password', 'confirmPassword'],
    2: ['username', 'firstName', 'secondName', 'firstLastName', 'secondLastName'],
    3: ['languages', 'preferences'],
  };

  const totalSteps = 3; // Número total de pasos

  const handleNextStep = async () => {
    const fieldsToValidate = stepFields[currentStep];
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep === 1) {
        const { password, confirmPassword } = getValues();
        if (password !== confirmPassword) {
          toast.error(t('passwords_do_not_match'));
          return;
        }
      }

      setFormData({ ...formData, ...getValues() });
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setFormData({ ...formData, ...getValues() });
    setCurrentStep(currentStep - 1);
  };

  const navigate = useNavigate(); // Inicializar useNavigate
  const location = useLocation(); // Inicializar useLocation

  const { mutate: signUp, isPending: isRegistering } = useSignUp();

  const handleRegister = async (values: RegisterFormData) => {
    const finalData = { ...formData, ...values };
    console.log('Register form submitted:', finalData);

    const userData = {
      username: finalData.username,
      firstName: finalData.firstName,
      secondName: finalData.secondName,
      firstLastName: finalData.firstLastName,
      secondLastName: finalData.secondLastName,
      email: finalData.email,
      password: finalData.password,
      languages: finalData.languages,
      preferences: finalData.preferences,
      role: finalData.role as UserRole,
    };

    signUp(userData, {
      onSuccess: (data: ApiResponse<LoginResponse>) => {
        console.log('Registration successful:', data);
        toast.success(data.message || t('registration_successful'));
        // Redirigir al usuario a la página de la que vino o al dashboard
        const from = (location.state as { from?: string })?.from || '/dashboard';
        navigate(from, { replace: true });
      },
      onError: (err: ApiError) => {
        console.error('Registration failed:', err);
        let errorMessage = t('error_registration_failed');
        if (err.details) {
          if (typeof err.details === 'string') {
            try {
              const parsedDetails = JSON.parse(err.details);
              if (parsedDetails && typeof parsedDetails === 'object' && parsedDetails.message) {
                errorMessage = parsedDetails.message;
              }
            } catch (e) {
              errorMessage = err.details;
            }
          } else if (typeof err.details === 'object' && (err.details as any).message) {
            errorMessage = (err.details as any).message;
          }
        }
        toast.error(errorMessage);
      },
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">{t('register_title')}</CardTitle>
        <CardDescription className="text-center">
          {t('register_step', { currentStep, totalSteps })}
        </CardDescription>
        <Progress value={(currentStep / totalSteps) * 100} className="w-full mt-4" />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleRegister)}>
          {currentStep === 1 && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="register-email">{t('email_username_label')}</Label>
                <Input
                  id="register-email"
                  type="email"
                  {...register('email')}
                  className="mt-1"
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="register-password">{t('password_label')}</Label>
                <Input
                  id="register-password"
                  type="password"
                  {...register('password')}
                  className="mt-1"
                />
                {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <Label htmlFor="register-confirmPassword">{t('confirm_password_label')}</Label>
                <Input
                  id="register-confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className="mt-1"
                />
                {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="register-username">{t('username_label')}</Label>
                <Input
                  id="register-username"
                  type="text"
                  {...register('username')}
                  className="mt-1"
                />
                {errors.username && <p className="text-destructive text-sm mt-1">{errors.username?.message}</p>}
              </div>
              <div>
                <Label htmlFor="register-firstName">{t('first_name_label')}</Label>
                <Input
                  id="register-firstName"
                  type="text"
                  {...register('firstName')}
                  className="mt-1"
                />
                {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <Label htmlFor="register-secondName">{t('second_name_label')}</Label>
                <Input
                  id="register-secondName"
                  type="text"
                  className="mt-1"
                  {...register('secondName')}
                />
                {errors.secondName && <p className="text-destructive text-sm mt-1">{errors.secondName.message}</p>}
              </div>
              <div>
                <Label htmlFor="register-firstLastName">{t('first_last_name_label')}</Label>
                <Input
                  id="register-firstLastName"
                  type="text"
                  {...register('firstLastName')}
                  className="mt-1"
                />
                {errors.firstLastName && <p className="text-destructive text-sm mt-1">{errors.firstLastName.message}</p>}
              </div>
              <div>
                <Label htmlFor="register-secondLastName">{t('second_last_name_label')}</Label>
                <Input
                  id="register-secondLastName"
                  type="text"
                  className="mt-1"
                  {...register('secondLastName')}
                />
                {errors.secondLastName && <p className="text-destructive text-sm mt-1">{errors.secondLastName.message}</p>}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 py-4"> {/* Aumentar el espacio entre secciones */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t('languages_section_title')}</h3> {/* Título para idiomas */}
                <p className="text-sm text-muted-foreground">{t('languages_section_description')}</p>
                <div className="flex flex-wrap gap-3 mt-2"> {/* Aumentar el espacio entre chips */}
                  {['es', 'en', 'kmt'].map((lang) => (
                    <Button
                      key={lang}
                      type="button"
                      variant={watchedLanguages.includes(lang) ? 'default' : 'outline'}
                      onClick={() => {
                        const currentLanguages = watchedLanguages;
                        if (currentLanguages.includes(lang)) {
                          setValue('languages', currentLanguages.filter((l) => l !== lang), { shouldValidate: true });
                        } else {
                          setValue('languages', [...currentLanguages, lang], { shouldValidate: true });
                        }
                      }}
                      className="px-4 py-2 rounded-full transition-colors duration-200"
                    >
                      {lang.toUpperCase()}
                    </Button>
                  ))}
                </div>
                {errors.languages && <p className="text-destructive text-sm mt-1">{errors.languages.message}</p>}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('preferences_section_title')}</h3> {/* Título para preferencias */}
                <p className="text-sm text-muted-foreground">{t('preferences_section_description')}</p>

                <div className="space-y-2"> {/* Agrupar Label y Select con espacio */}
                  <Label htmlFor="preferences.language" className="block text-sm font-medium">{t('preferred_language_label')}</Label>
                  <Controller
                    name="preferences.language"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full"> {/* Asegurar que ocupe todo el ancho */}
                          <SelectValue placeholder={t('select_language_placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">{t('spanish')}</SelectItem>
                          <SelectItem value="en">{t('english')}</SelectItem>
                          <SelectItem value="kmt">{t('Kamentsa')}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.preferences?.language && <p className="text-destructive text-sm mt-1">{errors.preferences.language.message}</p>}
                </div>

                <div className="space-y-2"> {/* Agrupar Label y Select con espacio */}
                  <Label htmlFor="preferences.theme" className="block text-sm font-medium">{t('preferred_theme_label')}</Label>
                  <Controller
                    name="preferences.theme"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full"> {/* Asegurar que ocupe todo el ancho */}
                          <SelectValue placeholder={t('select_theme_placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">{t('light_theme')}</SelectItem>
                          <SelectItem value="dark">{t('dark_theme')}</SelectItem>
                          <SelectItem value="system">{t('system_theme')}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.preferences?.theme && <p className="text-destructive text-sm mt-1">{errors.preferences.theme.message}</p>}
                </div>

                <div className="flex items-center justify-between p-2 border rounded-md"> {/* Contenedor para Switch */}
                  <Label htmlFor="preferences.notifications" className="text-base">{t('notifications_label')}</Label>
                  <Controller
                    name="preferences.notifications"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="preferences.notifications"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                {errors.preferences?.notifications && <p className="col-span-4 text-destructive text-sm">{errors.preferences.notifications.message}</p>}
              </div>
            </div>
          )}


          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handlePrevStep}>
                {t('previous_button')}
              </Button>
            )}
            {currentStep < totalSteps && (
              <Button type="button" onClick={handleNextStep}>
                {t('next_button')}
              </Button>
            )}
            {currentStep === totalSteps && (
              <Button type="submit" disabled={isRegistering}>
                {isRegistering ? t('registering') : t('register_button')}
              </Button>
            )}
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          {t('already_have_account_question')}{' '}
          <Button variant="link" type="button" onClick={() => changeView('login')} className="p-0 h-auto">
            {t('login_button')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
