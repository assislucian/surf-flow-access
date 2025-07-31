// src/components/ui/pricing-section.tsx
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import React from "react";

type PlanKey = "singleSession" | "multiSession" | "dayPass";

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (value && typeof value === "object") return Object.values(value as Record<string, string>).map(String);
  if (typeof value === "string" && value.trim().length > 0) return [value];
  return [];
}

function PlanCard({ planKey }: { planKey: PlanKey }) {
  const { t } = useTranslation();

  const title = t(`pricing.${planKey}.title`, { defaultValue: planKey });
  const price = t(`pricing.${planKey}.price`, { defaultValue: "" });
  const unit = t(`pricing.${planKey}.unit`, { defaultValue: "" });
  const cta = t(`pricing.${planKey}.cta`, { defaultValue: t("pricing.bookNow", { defaultValue: "Book now" }) });

  const raw = t(`pricing.${planKey}.features`, { returnObjects: true, defaultValue: [] as unknown });
  const features = toArray(raw);

  return (
    <div className="rounded-xl border bg-background p-6 shadow-sm hover:shadow-md transition">
      <div className="mb-3 text-lg font-semibold">{title}</div>
      {(price || unit) && (
        <div className="mb-4 text-2xl font-bold">
          {price} <span className="text-muted-foreground text-base font-medium">{unit}</span>
        </div>
      )}
      <div className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <Check className="w-5 h-5 mr-3" />
            <span>{feature}</span>
          </div>
        ))}
        {features.length === 0 && (
          <div className="text-sm text-muted-foreground">
            {t("pricing.noFeatures", { defaultValue: "Details coming soon." })}
          </div>
        )}
      </div>
      <button className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-95">
        {cta}
      </button>
    </div>
  );
}

function PricingSection() {
  const { t } = useTranslation();

  const heading = t("pricing.title", { defaultValue: "Prices & Packages" });
  const subtitle = t("pricing.subtitle", {
    defaultValue: "Choose the perfect package for your surfskate session.",
  });

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">{heading}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <PlanCard planKey="singleSession" />
        <PlanCard planKey="multiSession" />
        <PlanCard planKey="dayPass" />
      </div>
    </section>
  );
}

// Export both forms so imports never break:
export { PricingSection };
export default PricingSection;
