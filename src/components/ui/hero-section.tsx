import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Waves, Activity, Clock, Shield } from "lucide-react";
import heroImage from "@/assets/hero-surfskate.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
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
              Surfskatehalle
            </h1>
          </div>
          
          {/* Hero text */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Erlebe das ultimative Surf- und Skate-Abenteuer in unserer modernen Halle. 
            Buche jetzt deine Session und erhalte sofortigen Zugang.
          </p>
          
          {/* CTA Button */}
          <div className="mb-12">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold shadow-energy transition-all duration-300 hover:shadow-glow hover:scale-105"
            >
              Jetzt buchen
            </Button>
          </div>
          
          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="bg-card/90 backdrop-blur-sm border-border/50 p-6 hover:shadow-energy transition-all duration-300">
              <Activity className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-card-foreground mb-2">Premium Equipment</h3>
              <p className="text-muted-foreground text-sm">
                Modernste Surf- und Skate-Anlagen für alle Skill-Level
              </p>
            </Card>
            
            <Card className="bg-card/90 backdrop-blur-sm border-border/50 p-6 hover:shadow-energy transition-all duration-300">
              <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-card-foreground mb-2">Flexible Buchung</h3>
              <p className="text-muted-foreground text-sm">
                Buche stundenweise nach deinen Wünschen
              </p>
            </Card>
            
            <Card className="bg-card/90 backdrop-blur-sm border-border/50 p-6 hover:shadow-energy transition-all duration-300">
              <Shield className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-card-foreground mb-2">Sicherer Zugang</h3>
              <p className="text-muted-foreground text-sm">
                Automatische PIN-Codes per E-Mail nach der Bezahlung
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};