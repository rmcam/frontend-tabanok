import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          type: "email",
          placeholder: "Email",
        },
        password: {
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        console.log("Received credentials:", credentials);
        try {
          // Filtrar las credenciales para evitar que se envíen valores inesperados
          const { email, password } = credentials;
          if (!email || !password) {
            return null;
          }
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            }
          );

          const data = await res.json();

          if (!res.ok || !data.accessToken) {
            console.error("Error en la autenticación:", data);
            return null;
          }

          return {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: data.user,
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          return error
        }
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
