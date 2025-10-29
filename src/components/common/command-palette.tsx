import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import React from "react"

interface CommandPaletteProps {
  children: React.ReactNode;
}

export function CommandPalette({ children }: CommandPaletteProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)

  const handleSelect = (url: string) => {
    setOpen(false)
    navigate(url)
  }

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Define command items. This could be dynamic based on routes, user roles, etc.
  const commandItems = [
    {
      group: t("General"),
      items: [
        { label: t("Dashboard"), value: "dashboard", url: "/dashboard" },
        { label: t("Home"), value: "home", url: "/" },
        { label: t("Inbox"), value: "inbox", url: "/inbox" },
        { label: t("Calendar"), value: "calendar", url: "/calendar" },
      ],
    },
    {
      group: t("Aprendizaje"),
      items: [
        { label: t("Cursos"), value: "courses", url: "/courses" },
        { label: t("Lecciones"), value: "lessons", url: "/lessons" },
        { label: t("Progreso"), value: "progress", url: "/progress" },
      ],
    },
    {
      group: t("Configuración"),
      items: [
        { label: t("Perfil"), value: "profile", url: "/profile" },
        { label: t("Seguridad"), value: "security", url: "/security" },
        { label: t("Ajustes"), value: "settings", url: "/settings" },
      ],
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="p-0 max-w-[600px]">
        <VisuallyHidden asChild>
          <DialogTitle>{t("Búsqueda de comandos")}</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>{t("Navega por la aplicación usando comandos.")}</DialogDescription>
        </VisuallyHidden>
        <Command>
          <CommandInput placeholder={t("Buscar en la aplicación...")} />
          <CommandList>
            <CommandEmpty>{t("No se encontraron resultados.")}</CommandEmpty>
            {commandItems.map((group) => (
              <CommandGroup key={group.group} heading={group.group}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => handleSelect(item.url)}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
