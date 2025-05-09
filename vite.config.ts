import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000, // Aumentar el límite a 1000 KB (1 MB)
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("lodash")) {
                return "lodash";
              }
              if (id.includes("date-fns")) {
                return "date-fns";
              }
              if (id.includes("d3")) {
                return "d3";
              }
              if (id.includes("recharts")) {
                return "recharts";
              }
              if (id.includes("framer-motion")) {
                return "framer-motion";
              }
              if (id.includes("lucide-react")) {
                return "lucide-react";
              }
              if (id.includes("react") || id.includes("react-dom")) {
                return "react-vendor";
              }

              const parts = id.split("/");
              let packageName = parts[parts.indexOf("node_modules") + 1];
              if (packageName.startsWith("@")) {
                packageName = `${packageName}/${parts[parts.indexOf("node_modules") + 2]}`;
              }
              return packageName;
            }
          },
        },
      },
    },
  };
});
