import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Loading from '@/components/common/Loading'; // Import Loading component
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { cn } from "@/lib/utils"; // Import cn utility
import { Input } from '@/components/ui/input';

const ForgotPasswordForm: React.FC = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [email, setEmail] = useState('');
  // Use useAuth hook from context and get forgotPassword and requestingPasswordReset state
  const { forgotPassword, requestingPasswordReset } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null); // Use localError for basic email validation

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null); // Clear previous local errors

    if (!email) {
      setLocalError(t('auth.forgotPassword.validation.emailRequired'));
      return;
    }

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError(t('auth.forgotPassword.validation.emailInvalid'));
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
          <Label htmlFor="email">
            {t('auth.forgotPassword.label.email')} {/* Use translation */}
          </Label>
          <Input
            type="email"
            id="email"
            placeholder={t('auth.forgotPassword.placeholder.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={cn(
              localError && 'border-destructive'
            )}
            aria-invalid={!!localError}
            aria-describedby={localError ? 'email-error' : undefined}
            ref={emailRef}
            spellCheck // Enable spellcheck
          />
        </div>
        {localError && <p id="email-error" className="text-destructive text-sm mt-1">{localError}</p>} {/* Display local validation error */}
        <Button type="submit" className="w-full" disabled={requestingPasswordReset}> {/* Use default variant */}
          {requestingPasswordReset ? <Loading /> : t('auth.forgotPassword.button.sendResetLink')} {/* Use context loading state */}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
