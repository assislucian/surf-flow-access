import { HeroSection } from "@/components/ui/hero-section";
import PricingSection from "@/components/ui/pricing-section";
import FAQSection from "@/components/ui/faq-section";
import { Footer } from "@/components/ui/footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
