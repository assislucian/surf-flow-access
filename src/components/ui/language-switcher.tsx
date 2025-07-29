import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'de' ? 'en' : 'de';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90"
    >
      <Languages className="w-4 h-4 mr-2" />
      {t('language.switchTo')}
    </Button>
  );
};