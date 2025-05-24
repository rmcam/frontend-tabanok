import { useTranslation } from "react-i18next"

export function useLanguage() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return { changeLanguage, currentLanguage: i18n.language }
}
