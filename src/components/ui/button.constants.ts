import { cva } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-k-verde-500 text-k-blanco-50 shadow-xs hover:bg-k-verde-600", // Mapeado a k-verde
        destructive:
          "bg-k-rojo-500 text-k-blanco-50 shadow-xs hover:bg-k-rojo-600 focus-visible:ring-k-rojo-200 dark:focus-visible:ring-k-rojo-400", // Mapeado a k-rojo
        outline:
          "border border-k-verde-500 text-k-verde-500 bg-transparent shadow-xs hover:bg-k-verde-500 hover:text-k-blanco-50", // Mapeado a k-verde outline
        secondary:
          "bg-k-amarillo-500 text-k-negro-500 shadow-xs hover:bg-k-amarillo-600", // Mapeado a k-amarillo
        ghost:
          "text-k-verde-500 hover:bg-k-verde-100", // Mapeado a k-verde ghost
        link: "text-k-azul-500 underline-offset-4 hover:underline", // Mapeado a k-azul
      },
      size: {
        default: "h-9 px-3 py-2 has-[>svg]:px-2",
        sm: "h-8 rounded-md gap-1.5 px-2 py-1 has-[>svg]:px-1.5",
        lg: "h-10 rounded-md px-3 py-2 has-[>svg]:px-2",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export { buttonVariants }
