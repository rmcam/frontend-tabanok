import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
// https://vite.dev/config/
export default defineConfig({
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
          if (id.includes('node_modules')) {
            // Separa las dependencias grandes en un chunk 'vendor'
            const modulesToSplit = ['react', 'react-dom', 'lucide-react', 'recharts', 'framer-motion', 'date-fns'];
            const matchedModule = modulesToSplit.find(module => id.includes(module));
            if (matchedModule) {
              return 'vendor';
            }
            // Opcional: agrupar otras dependencias de node_modules
            // return 'vendor';
          }
        },
      },
    },
  },
})
