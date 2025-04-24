import { Input } from '@/components/ui';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Loading from '@/components/common/Loading'; // Import Loading component
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  // Use useAuth hook from context and get forgotPassword and requestingPasswordReset state
  const { forgotPassword, requestingPasswordReset } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null); // Use localError for basic email validation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null); // Clear previous local errors

    if (!email) {
      setLocalError('Por favor, ingresa tu correo electrónico.');
      return;
    }

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    try {
      await forgotPassword(email);
      // Success message is handled by showToast in AuthContext
    } catch (error: unknown) { // Usar unknown para un manejo de errores más seguro
      // Error message is handled by showToast in AuthContext
      console.error("Error sending email:", error); // Keep console log for debugging
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <div className="grid gap-3">
          <Label htmlFor="email" className="text-sm text-gray-700">
            Correo electrónico
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // Keep HTML required for basic browser validation
            className={`w-full rounded-lg border ${localError ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
            aria-invalid={!!localError} // Indicate invalid state based on local error
          />
        </div>
        {localError && <p className="text-red-500 text-sm mt-1">{localError}</p>} {/* Display local validation error */}
        <Button type="submit" className="w-full rounded-lg py-2" disabled={requestingPasswordReset}>
          {requestingPasswordReset ? <Loading /> : 'Enviar enlace de restablecimiento'} {/* Use context loading state */}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
