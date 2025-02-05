"use server";

import { signUpSchema } from "@/lib/zod";
import { AuthError } from "next-auth";

import { z } from "zod";

export const registerAction = async (values: z.infer<typeof signUpSchema>) => {
  try {
    const { data, success } = signUpSchema.safeParse(values);
    if (!success) {
      return { error: "Invalid fields!" };
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message };
    }
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "error 500" };
  }
};
