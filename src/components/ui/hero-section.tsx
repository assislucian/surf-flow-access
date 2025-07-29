import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Waves, Activity, Clock, Shield } from "lucide-react";
import { useTranslation } from 'react-i18next';
import heroImage from "@/assets/hero-surfskate-hall.jpg";

export const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
      </div>
      
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo placeholder */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-foreground/90 rounded-full mb-4 shadow-glow">
              <Waves className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-4">
              {t('hero.title')}
            </h1>
          </div>
          
          {/* Hero text */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('hero.tagline')}
          </p>
          
          {/* CTA Button */}
          <div className="mb-12">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold shadow-energy transition-all duration-300 hover:shadow-glow hover:scale-105"
            >
              {t('hero.cta')}
            </Button>
          </div>
          
          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="bg-card/90 backdrop-blur-sm border-border/50 p-6 hover:shadow-energy transition-all duration-300">
              <Activity className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-card-foreground mb-2">{t('features.equipment.title')}</h3>
              <p className="text-muted-foreground text-sm">
                {t('features.equipment.description')}
              </p>
            </Card>
            
            <Card className="bg-card/90 backdrop-blur-sm border-border/50 p-6 hover:shadow-energy transition-all duration-300">
              <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-card-foreground mb-2">{t('features.booking.title')}</h3>
              <p className="text-muted-foreground text-sm">
                {t('features.booking.description')}
              </p>
            </Card>
            
            <Card className="bg-card/90 backdrop-blur-sm border-border/50 p-6 hover:shadow-energy transition-all duration-300">
              <Shield className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-card-foreground mb-2">{t('features.access.title')}</h3>
              <p className="text-muted-foreground text-sm">
                {t('features.access.description')}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};