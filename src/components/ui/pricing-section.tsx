import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export const PricingSection = () => {
  return (
    <section className="py-20 bg-gradient-wave">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Preise & Pakete
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Wähle das perfekte Paket für deine Surf- und Skate-Session
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic Package */}
          <Card className="border-2 hover:shadow-energy transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Einzel-Session</CardTitle>
              <CardDescription>Perfekt für den ersten Versuch</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-primary">€25</span>
                <span className="text-muted-foreground">/Stunde</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-3" />
                <span>1 Stunde Zugang</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-3" />
                <span>Surf- oder Skate-Bereich</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-3" />
                <span>Equipment inklusive</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-3" />
                <span>PIN-Zugang per E-Mail</span>
              </div>
              <Button className="w-full mt-6">Session buchen</Button>
            </CardContent>
          </Card>
          
          {/* Premium Package */}
          <Card className="border-2 border-primary hover:shadow-glow transition-all duration-300 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Beliebt
              </span>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Multi-Session</CardTitle>
              <CardDescription>Für regelmäßige Besucher</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-primary">€20</span>
                <span className="text-muted-foreground">/Stunde</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-3" />
                <span>3+ Stunden Zugang</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-3" />
                <span>Beide Bereiche verfügbar</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-3" />
                <span>Premium Equipment</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-3" />
                <span>Flexibler Zugang</span>
              </div>
              <Button className="w-full mt-6 bg-primary hover:bg-primary/90">
                Buchen & Sparen
              </Button>
            </CardContent>
          </Card>
          
          {/* Pro Package */}
          <Card className="border-2 hover:shadow-energy transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Tages-Pass</CardTitle>
              <CardDescription>Unbegrenzter Zugang</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-primary">€80</span>
                <span className="text-muted-foreground">/Tag</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-3" />
                <span>Unbegrenzter Zugang</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-3" />
                <span>Alle Bereiche inklusive</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-3" />
                <span>VIP Equipment</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-3" />
                <span>Prioritäts-Support</span>
              </div>
              <Button className="w-full mt-6">Tages-Pass buchen</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};