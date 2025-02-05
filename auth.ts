import authConfig from "@/auth.config";
import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  //  By default, the `id` property does not exist on `token` or `session`. See the [TypeScript](https://authjs.dev/getting-started/typescript) on how to add it.
  callbacks: {
    // jwt() se ejecuta cada vez que se crea o actualiza un token JWT.
    // Aquí es donde puedes agregar información adicional al token.
    jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    // session() se utiliza para agregar la información del token a la sesión del usuario,
    // lo que hace que esté disponible en el cliente.
    session({ session, token }) {
      if (session.user) {
        session.user = token.user;
      }
      return session;
    },
  },
});
