import { Waves, MapPin, Phone, Mail, Clock } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Waves className="w-8 h-8 mr-3" />
              <span className="text-2xl font-bold">Surfskatehalle</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              Deine moderne Surf- und Skate-Halle im Herzen der Stadt. 
              Erlebe Action und Adrenalin in sicherer Umgebung.
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors cursor-pointer">
                <span className="text-sm font-bold">FB</span>
              </div>
              <div className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors cursor-pointer">
                <span className="text-sm font-bold">IG</span>
              </div>
              <div className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors cursor-pointer">
                <span className="text-sm font-bold">YT</span>
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-primary-foreground/60" />
                <span className="text-sm">
                  Sportstraße 123<br />
                  12345 Berlin
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-primary-foreground/60" />
                <span className="text-sm">+49 30 123 456 789</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-primary-foreground/60" />
                <span className="text-sm">info@surfskatehalle.de</span>
              </div>
            </div>
          </div>
          
          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Öffnungszeiten</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-primary-foreground/60" />
                <div className="text-sm">
                  <div>Mo-Fr: 14:00 - 22:00</div>
                  <div>Sa-So: 10:00 - 22:00</div>
                  <div className="text-primary-foreground/60">Feiertage: 12:00 - 20:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 Surfskatehalle. Alle Rechte vorbehalten.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
              Impressum
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
              Datenschutz
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
              AGB
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};