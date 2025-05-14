import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000, // Aumentar el límite a 1000 KB (1 MB)
    },
  server: {
    host: "localhost",
    hmr: {
     protocol: "ws",
   },
  },
  cors: {
    origin: "*", // Permitir solicitudes desde cualquier origen (solo para desarrollo)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  test: {
    environment: 'jsdom',
  },
};
});
