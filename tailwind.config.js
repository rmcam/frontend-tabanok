/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)", // Corregido
          foreground: "var(--primary-foreground)", // Corregido
        },
        secondary: {
          DEFAULT: "var(--secondary)", // Corregido
          foreground: "var(--secondary-foreground)", // Corregido
        },
        destructive: {
          DEFAULT: "var(--destructive)", // Corregido
          foreground: "var(--destructive-foreground)", // Corregido y variable CSS añadida
        },
        muted: {
          DEFAULT: "var(--muted)", // Corregido
          foreground: "var(--muted-foreground)", // Corregido
        },
        accent: {
          DEFAULT: "var(--accent)", // Corregido
          foreground: "var(--accent-foreground)", // Corregido
        },
        popover: {
          DEFAULT: "var(--popover)", // Corregido
          foreground: "var(--popover-foreground)", // Corregido
        },
        card: {
          DEFAULT: "var(--card)", // Corregido
          foreground: "var(--card-foreground)", // Corregido
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // Si estás usando las animaciones de Radix o similar,
  // es común usar el plugin 'tailwindcss-animate'.
  // Si 'tw-animate-css' es un archivo CSS que importas, está bien.
  plugins: [require("tailwindcss-animate")], // Ejemplo, si necesitas este plugin
};