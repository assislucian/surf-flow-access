import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useTranslation } from 'react-i18next';

export const PricingSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-wave">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic Package */}
          <Card className="border-2 hover:shadow-energy transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t('pricing.singleSession.title')}</CardTitle>
              <CardDescription>{t('pricing.singleSession.description')}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-primary">{t('pricing.singleSession.price')}</span>
                <span className="text-muted-foreground">/{t('pricing.singleSession.duration')}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(t('pricing.singleSession.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                <div key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-3" />
                  <span>{feature}</span>
                </div>
              ))}
              <Button className="w-full mt-6">{t('pricing.cta')}</Button>
            </CardContent>
          </Card>
          
          {/* Premium Package */}
          <Card className="border-2 border-primary hover:shadow-glow transition-all duration-300 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                {t('pricing.multiSession.popular')}
              </span>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t('pricing.multiSession.title')}</CardTitle>
              <CardDescription>{t('pricing.multiSession.description')}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-primary">{t('pricing.multiSession.price')}</span>
                <span className="text-muted-foreground">/{t('pricing.multiSession.duration')}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(t('pricing.multiSession.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                <div key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-3" />
                  <span>{feature}</span>
                </div>
              ))}
              <Button className="w-full mt-6 bg-primary hover:bg-primary/90">
                {t('pricing.cta')}
              </Button>
            </CardContent>
          </Card>
          
          {/* Pro Package */}
          <Card className="border-2 hover:shadow-energy transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t('pricing.dayPass.title')}</CardTitle>
              <CardDescription>{t('pricing.dayPass.description')}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-primary">{t('pricing.dayPass.price')}</span>
                <span className="text-muted-foreground">/{t('pricing.dayPass.duration')}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(t('pricing.dayPass.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                <div key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-3" />
                  <span>{feature}</span>
                </div>
              ))}
              <Button 
                className="w-full mt-6"
                onClick={() => window.location.href = '/book'}
              >
                {t('pricing.cta')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};