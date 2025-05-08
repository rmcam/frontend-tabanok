import Loading from '@/components/common/Loading';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import useFormValidation from '@/hooks/useFormValidation';
import React, { FormEvent, useCallback, useState } from 'react'; // Import useState
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Import useAuth from hooks

interface ResetPasswordFormProps {
  newPassword: string;
  confirmPassword: string;
  [key: string]: string;
}

const ResetPasswordForm: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // Get token from URL parameters
  const navigate = useNavigate();
  const { resetPassword, resettingPassword } = useAuth(); // Assuming resetPassword and resettingPassword are added to useAuth

  const initialValues: ResetPasswordFormProps = {
    newPassword: '',
    confirmPassword: '',
  };

  const validationRules = React.useMemo(
    () => ({
      newPassword: (value: string) => {
        if (!value) return 'Nueva contraseña es requerida';
        if (value.length < 6) return 'Nueva contraseña debe tener al menos 6 caracteres';
        return undefined;
      },
      // Remove confirmPassword validation from rules passed to useFormValidation
      // confirmPassword: (value: string, values: ResetPasswordFormProps) => {
      //   if (!value) return 'Confirmar contraseña es requerido';
      //   if (value !== values.newPassword) return 'Las contraseñas no coinciden';
      //   return undefined;
      // },
    }),
    [],
  );

  const { values, errors, isValid, handleChange, handleSubmit: handleFormSubmit, setErrors } = // Get setErrors from useFormValidation
    useFormValidation<ResetPasswordFormProps>(initialValues); // Pass only initialValues here

  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null); // Local state for confirm password error


  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setConfirmPasswordError(null); // Clear previous confirm password error

      // Call the handleSubmit from the hook with validation rules for individual fields
      const validationResult = handleFormSubmit(validationRules)(event); // No assertion needed now

      // Manually validate confirm password
      if (values.newPassword !== values.confirmPassword) {
        setConfirmPasswordError('Las contraseñas no coinciden'); // Set local error state
        // Also update the errors state from useFormValidation for consistency
        setErrors(prevErrors => ({ ...prevErrors, confirmPassword: 'Las contraseñas no coinciden' }));
        console.log('Las contraseñas no coinciden.');
        return; // Stop submission if passwords don't match
      }


      if (!token) {
        // Handle case where token is missing (e.g., show error message, redirect)
        console.error('Token de restablecimiento de contraseña no encontrado.');
        // Optionally show a toast or redirect to forgot password page
        return;
      }

      // Use the isValid from the validation result for individual fields
      if (!validationResult.isValid) {
        console.log('Errores de validación en los campos individuales.');
        return;
      }

      try {
        // Assuming resetPassword function exists in AuthContext
        await resetPassword(token, values.newPassword);
        // If resetPassword completes without throwing an error, it was successful
        console.log('Contraseña restablecida exitosamente');
        navigate('/signin'); // Redirect to signin page after successful reset
      } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        // El AuthProvider ya maneja la visualización de los toasts de error.
      }
    },
    [token, values, handleFormSubmit, validationRules, resetPassword, navigate, setErrors], // Add setErrors to dependencies
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <div className="grid gap-3">
          <Label htmlFor="newPassword" className="text-sm text-gray-700">
            Nueva Contraseña
          </Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Nueva Contraseña"
            name="newPassword"
            value={values.newPassword}
            onChange={handleChange}
            aria-invalid={!!errors.newPassword}
            aria-describedby="newPassword-error"
          />
          {errors.newPassword && <p id="newPassword-error" className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword" className="text-sm text-gray-700">
            Confirmar Contraseña
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirmar Contraseña"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            aria-invalid={!!errors.confirmPassword || !!confirmPasswordError} // Check both errors state and local error state
            aria-describedby="confirmPassword-error"
          />
          {/* Display error from errors state or local confirmPasswordError */}
          {(errors.confirmPassword || confirmPasswordError) && <p id="confirmPassword-error" className="text-red-500 text-sm mt-1">{errors.confirmPassword || confirmPasswordError}</p>}
        </div>
        <Button type="submit" className="w-full rounded-lg py-2" disabled={!isValid || resettingPassword}>
          {resettingPassword ? <Loading /> : 'Restablecer Contraseña'}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
