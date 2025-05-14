import Loading from "@/components/common/Loading";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useFormValidation from "@/hooks/useFormValidation";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const SignUpForm = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const initialValues = {
    email: "",
    password: "",
    username: "",
    firstName: "",
    secondName: "",
    firstLastName: "",
    secondLastName: "",
  };

  const validationRules = React.useMemo(
    () => ({
      email: (value: string) => {
        if (!value) return t("auth.signup.validation.emailRequired");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return t("auth.signup.validation.emailInvalid");
        return undefined;
      },
      password: (value: string) => {
        if (!value) return t("auth.signup.validation.passwordRequired");
        if (value.length < 6)
          return t("auth.signup.validation.passwordMinLength");
        return undefined;
      },
      username: (value: string) => {
        if (!value) return t("auth.signup.validation.usernameRequired");
        return undefined;
      },
      firstName: (value: string) => {
        if (!value) return t("auth.signup.validation.firstNameRequired");
        return undefined;
      },
      secondName: () => {
        return undefined;
      },
      firstLastName: (value: string) => {
        if (!value) return t("auth.signup.validation.lastNameRequired");
        return undefined;
      },
      secondLastName: () => {
        return undefined;
      },
    }),
    [t]
  );

  const { signingUp, signup } = useAuth();

  const { values, errors, isValid, handleChange, handleSubmit, setErrors } =
    useFormValidation(initialValues);

  // Create refs for the first input in each step
  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set focus based on the current step
    if (step === 1 && emailRef.current) {
      emailRef.current.focus();
    } else if (step === 2 && firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, [step]);

  const nextStep = () => {
    let currentStepFields: (keyof typeof initialValues)[] = [];
    const stepValidationRules: {
      [key: string]: (value: string) => string | undefined;
    } = {};

    if (step === 1) {
      currentStepFields = ["email", "password", "username"];
    } else if (step === 2) {
      currentStepFields = ["firstName", "firstLastName"];
    }

    currentStepFields.forEach((field) => {
      if (validationRules[field]) {
        stepValidationRules[field] = validationRules[field];
      }
    });

    let stepIsValid = true;
    const stepErrors: { [key: string]: string } = {};

    currentStepFields.forEach((field) => {
      const value = values[field];
      const rule = validationRules[field];
      if (rule) {
        const error = rule(value);
        if (error) {
          stepErrors[field] = error;
          stepIsValid = false;
        }
      }
    });

    setErrors(stepErrors);

    if (stepIsValid) {
      setStep(step + 1);
    } else {
      console.log(`Validation errors in step ${step}. Cannot proceed.`);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4 text-center text-k-negro-700">
        {t("auth.signup.step", { step })}
      </div>
      <form
        onSubmit={async (event) => {
          const validationResult = handleSubmit(validationRules)(event);
          if (validationResult.isValid) {
            await signup(values);
          } else {
            console.log("Formulario inválido. No se enviará la petición de registro.");
          }
        }}
        className="w-full max-w-sm space-y-6"
      >
        {step === 1 && (
          <>
            <div className="grid gap-3">
              <Label
                htmlFor="email"
              >
                {t("auth.signup.label.email")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t("auth.signup.placeholder.email")}
                name="email"
                value={values.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
                className={cn(
                  errors.email && 'border-destructive'
                )}
                ref={emailRef}
                spellCheck // Enable spellcheck
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-destructive text-sm mt-1"
                >
                  {errors.email}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label
                htmlFor="password"
              >
                {t("auth.signup.label.password")}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={t("auth.signup.placeholder.password")}
                name="password"
                value={values.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
                className={cn(
                  errors.password && 'border-destructive'
                )}
                spellCheck // Enable spellcheck
              />
              {errors.password && (
                <p
                  id="password-error"
                  className="text-destructive text-sm mt-1"
                >
                  {errors.password}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label
                htmlFor="username"
              >
                {t("auth.signup.label.username")}
              </Label>
              <Input
                id="username"
                type="text"
                placeholder={t("auth.signup.placeholder.username")}
                name="username"
                value={values.username}
                onChange={handleChange}
                aria-invalid={!!errors.username}
                aria-describedby="username-error"
                className={cn(
                  errors.username && 'border-destructive'
                )}
                spellCheck // Enable spellcheck
              />
              {errors.username && (
                <p
                  id="username-error"
                  className="text-destructive text-sm mt-1"
                >
                  {errors.username}
                </p>
              )}
            </div>
            <Button
              type="button"
              onClick={nextStep}
              className="w-full mt-4" // Use default variant
            >
              {t("auth.signup.button.next")}
            </Button>
          </>
        )}
 
        {step === 2 && (
          <>
            <div className="grid gap-3">
              <Label
                htmlFor="firstName"
              >
                {t("auth.signup.label.firstName")}
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder={t("auth.signup.placeholder.firstName")}
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                aria-invalid={!!errors.firstName}
                aria-describedby="firstName-error"
                className={cn(
                  errors.firstName && 'border-destructive'
                )}
                ref={firstNameRef} // Attach the ref to the firstName input
                spellCheck // Enable spellcheck
              />
              {errors.firstName && (
                <p
                  id="firstName-error"
                  className="text-destructive text-sm mt-1"
                >
                  {errors.firstName}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label
                htmlFor="secondName"
              >
                {t("auth.signup.label.secondName")}
              </Label>
              <Input
                id="secondName"
                type="text"
                placeholder={t("auth.signup.placeholder.secondName")}
                name="secondName"
                value={values.secondName}
                onChange={handleChange}
                aria-invalid={!!errors.secondName}
                aria-describedby="secondName-error"
                className={cn(
                  errors.secondName && 'border-destructive'
                )}
                spellCheck // Enable spellcheck
              />
              {errors.secondName && (
                <p
                  id="secondName-error"
                  className="text-destructive text-sm mt-1"
                >
                  {errors.secondName}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label
                htmlFor="firstLastName"
              >
                {t("auth.signup.label.firstLastName")}
              </Label>
              <Input
                id="firstLastName"
                type="text"
                placeholder={t("auth.signup.placeholder.firstLastName")}
                name="firstLastName"
                value={values.firstLastName}
                onChange={handleChange}
                aria-invalid={!!errors.firstLastName}
                aria-describedby="firstLastName-error"
                className={cn(
                  errors.firstLastName && 'border-destructive'
                )}
                spellCheck // Enable spellcheck
              />
              {errors.firstLastName && (
                <p
                  id="firstLastName-error"
                  className="text-destructive text-sm mt-1"
                >
                  {errors.firstLastName}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label
                htmlFor="secondLastName"
              >
                {t("auth.signup.label.secondLastName")}
              </Label>
              <Input
                id="secondLastName"
                type="text"
                placeholder={t("auth.signup.placeholder.secondLastName")}
                name="secondLastName"
                value={values.secondLastName}
                onChange={handleChange}
                aria-invalid={!!errors.secondLastName}
                aria-describedby="secondLastName-error"
                className={cn(
                  errors.secondLastName && 'border-destructive'
                )}
                spellCheck // Enable spellcheck
              />
              {errors.secondLastName && (
                <p
                  id="secondLastName-error"
                  className="text-destructive text-sm mt-1"
                >
                  {errors.secondName}
                </p>
              )}
            </div>
            <Button
              type="button"
              onClick={prevStep}
              className="w-full mt-4" // Use default variant
              variant="secondary" // Use secondary variant for previous button
            >
              {t("auth.signup.button.previous")}
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              className="w-full" // Use default variant
            >
              {t("auth.signup.button.next")}
            </Button>
          </>
        )}
 
        {step === 3 && (
          <>
            <div className="space-y-2 text-foreground"> {/* Use text-foreground */}
              <p className="font-semibold">
                {t("auth.signup.confirmation.title")}
              </p>
              <p>
                {t("auth.signup.confirmation.email", { email: values.email })}
              </p>
              <p>
                {t("auth.signup.confirmation.username", {
                  username: values.username,
                })}
              </p>
              <p>
                {t("auth.signup.confirmation.firstName", {
                  firstName: values.firstName,
                })}
              </p>
              <p>
                {t("auth.signup.confirmation.secondName", {
                  secondName: values.secondName,
                })}
              </p>
              <p>
                {t("auth.signup.confirmation.firstLastName", {
                  firstLastName: values.firstLastName,
                })}
              </p>
              <p>
                {t("auth.signup.confirmation.secondLastName", {
                  secondLastName: values.secondLastName,
                })}
              </p>
            </div>
            <Button
              type="button"
              onClick={prevStep}
              className="w-full mt-4" // Use default variant
              variant="secondary" // Use secondary variant for previous button
            >
              {t("auth.signup.button.previous")}
            </Button>
            <Button
              type="submit"
              className="w-full" // Use default variant
              disabled={!isValid || signingUp}
            >
              {signingUp ? <Loading /> : t("auth.signup.button.signUp")}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};
 
export default SignUpForm;
