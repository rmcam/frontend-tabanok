import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  "aria-describedby"?: string;
}

function Input({ className, type, "aria-describedby": ariaDescribedby, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-k-negro-300 selection:bg-k-verde-500 selection:text-k-blanco-50 dark:bg-k-negro-800/30 border-k-negro-200 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-k-azul-500 focus-visible:ring-k-azul-500/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-k-rojo-500/20 dark:aria-invalid:ring-k-rojo-500/40 aria-invalid:border-k-rojo-500",
        className
      )}
      aria-describedby={ariaDescribedby}
      {...props}
    />
  )
}

export { Input }
