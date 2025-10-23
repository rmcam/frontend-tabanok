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
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        "blob-reverse": {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(-30px, 50px) scale(0.9)",
          },
          "66%": {
            transform: "translate(20px, -20px) scale(1.1)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        "pulse-once": {
          "0%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        blob: "blob 7s infinite",
        "blob-reverse": "blob-reverse 7s infinite",
        "bounce-slow": "bounce 3s infinite",
        "spin-slow": "spin 10s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-once": "pulse-once 1s ease-out", // Animación de pulso una vez
        "fade-in-up": "fade-in-up 0.5s ease-out forwards", // Animación de aparición y deslizamiento hacia arriba
      },
    },
  },
  // Si estás usando las animaciones de Radix o similar,
  // es común usar el plugin 'tailwindcss-animate'.
  // Si 'tw-animate-css' es un archivo CSS que importas, está bien.
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss/plugin")(function ({ addUtilities }) {
      const newUtilities = {
        '.animation-delay-2000': {
          'animation-delay': '2s',
        },
        '.animation-delay-4000': {
          'animation-delay': '4s',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    }),
  ],
};
