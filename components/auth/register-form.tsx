"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { registerAction } from "@/actions/auth-action";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/lib/zod";

export const RegisterForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, setIsPending] = useState(false); // Estado de carga;

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "Andres",
      secondName: "Camilo",
      firstLastName: "Rodriguez",
      secondLastName: "Miramag",
      email: "admin@admin.com",
      password: "admin123",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setError(undefined);
    setSuccess(undefined);
    setIsPending(true); // Activar estado de carga

    try {
      const response = await registerAction(values);
      if (response.error) {
        setError(response.error);
      }
      if (response.ok) {
        setSuccess(response.message);
        router.push("/sign-in");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false); // Desactivar estado de carga
    }
  }
  return (
    <CardWrapper
      headerLabel="Crear cuenta"
      backButtonLabel="¿Ya tienes una cuenta?"
      backButtonHref="/sign-in"
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            {/** Primer Nombre */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primer Nombre</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Juan"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/** Segundo Nombre */}
            <FormField
              control={form.control}
              name="secondName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Segundo Nombre</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Opcional"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/** Primer Apellido */}
            <FormField
              control={form.control}
              name="firstLastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primer Apellido</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Pérez"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/** Segundo Apellido */}
            <FormField
              control={form.control}
              name="secondLastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Segundo Apellido</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Opcional"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/** Correo Electrónico */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="correo@ejemplo.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/** Contraseña */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="********"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/** Mensajes de Error/Éxito */}
            <FormError message={error} />
            <FormSuccess message={success} />
            {/** Botón de Enviar */}
            <Button
              disabled={isPending}
              type="submit"
              className="w-full"
            >
              {isPending ? "Registrando..." : "Crear cuenta"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
