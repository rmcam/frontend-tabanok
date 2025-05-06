import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useFormValidation from '@/hooks/useFormValidation';

interface ContactFormProps {
  name: string;
  email: string;
  message: string;
  [key: string]: string;
}

const ContactForm = () => {
  const initialValues: ContactFormProps = {
    name: '',
    email: '',
    message: '',
  };

  const validationRules = React.useMemo(
    () => ({
      name: (value: string) => {
        if (!value) return 'Nombre es requerido';
        return undefined;
      },
      email: (value: string) => {
        if (!value) return 'Email es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email no es válido';
        return undefined;
      },
      message: (value: string) => {
        if (!value) return 'Mensaje es requerido';
        return undefined;
      },
    }),
    [],
  );

  const { values, errors, isValid, handleChange, handleSubmit } =
    useFormValidation<ContactFormProps>(initialValues);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(validationRules)(e);
    if (isValid) {
      // Aquí iría la lógica para enviar el formulario
      alert('Formulario válido, enviando...');
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto">
      <div className="grid gap-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="block text-gray-700 text-lg font-bold mb-2">
            Nombre
          </label>
          <Input
            type="text"
            id="name"
            placeholder="Tu nombre"
            name="name"
            value={values.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
            aria-invalid={!!errors.name}
            aria-describedby="name-error"
          />
          {errors.name && (
            <p id="name-error" className="text-red-500 text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="block text-gray-700 text-lg font-bold mb-2">
            Correo electrónico
          </label>
          <Input
            type="email"
            id="email"
            placeholder="Tu correo electrónico"
            name="email"
            value={values.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="message" className="block text-gray-700 text-lg font-bold mb-2">
            Mensaje
          </label>
          <Textarea
            id="message"
            placeholder="Tu mensaje"
            name="message"
            value={values.message}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
            aria-invalid={!!errors.message}
            aria-describedby="message-error"
          />
          {errors.message && (
            <p id="message-error" className="text-red-500 text-sm mt-1">
              {errors.message}
            </p>
          )}
        </div>
        <div>
          <Button variant="default" type="submit" disabled={!isValid}>Enviar mensaje</Button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
