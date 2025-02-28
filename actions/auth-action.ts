"use server";

import { signUpSchema } from "@/lib/zod";

import { z } from "zod";

export const registerAction = async (values: z.infer<typeof signUpSchema>) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );
  console.log("res", res);
  if (res.ok === false) {
    return {
      error: res.status === 409 ? "El correo ya existe" : res.statusText,
    };
  } else {
    return {
      ok: true,
      message:
        res.status === 201 ? "Usuario creado exitosamente" : res.statusText,
    };
  }
};
