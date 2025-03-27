"use server";

import { signUpSchema } from "@/lib/zod";

import { z } from "zod";

export const registerAction = async (values: z.infer<typeof signUpSchema>) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        error: errorData.message || res.statusText || "Error al registrar usuario",
      };
    }

    const data = await res.json();
    return {
      ok: true,
      message: "Usuario creado exitosamente",
      data,
    };
  } catch (error) {
    console.error("Error en registerAction:", error);
    return {
      error: "Error de conexión con el servidor",
    };
  }
};
