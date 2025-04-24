import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactForm = () => {
  return (
    <form className="max-w-md mx-auto">
      <div className="grid gap-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="block text-gray-700 text-lg font-bold mb-2">
            Nombre
          </label>
          <Input
            type="text"
            id="name"
            placeholder="Tu nombre"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="block text-gray-700 text-lg font-bold mb-2">
            Correo electrónico
          </label>
          <Input
            type="email"
            id="email"
            placeholder="Tu correo electrónico"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="message" className="block text-gray-700 text-lg font-bold mb-2">
            Mensaje
          </label>
          <Textarea
            id="message"
            placeholder="Tu mensaje"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
          />
        </div>
        <div>
          <Button variant="default">Enviar mensaje</Button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
