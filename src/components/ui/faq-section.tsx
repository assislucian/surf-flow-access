// src/components/ui/faq-section.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type FAQ = { question: string; answer: string };

function toFAQArray(value: unknown): FAQ[] {
  if (Array.isArray(value)) {
    // Array of strings or objects → normalize
    return (value as any[]).map((v) =>
      typeof v === "object" && v !== null
        ? { question: String((v as any).question ?? ""), answer: String((v as any).answer ?? "") }
        : { question: String(v ?? ""), answer: "" }
    );
  }
  if (value && typeof value === "object") {
    // Object map → values
    return Object.values(value as Record<string, any>).map((v) => ({
      question: String(v?.question ?? ""),
      answer: String(v?.answer ?? ""),
    }));
  }
  // Single string or empty
  if (typeof value === "string" && value.trim()) return [{ question: value, answer: "" }];
  return [];
}

export default function FAQSection() {
  const { t } = useTranslation();

  const heading = t("faq.title", { defaultValue: "Frequently Asked Questions" });
  const subtitle = t("faq.subtitle", {
    defaultValue: "Everything you need to know about our surfskate hall",
  });

  const raw = t("faq.items", { returnObjects: true, defaultValue: [] as unknown });
  const faqs = toFAQArray(raw);

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">{heading}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.length > 0 ? (
          faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 hover:shadow-sm transition-all"
            >
              <AccordionTrigger className="text-left font-semibold hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">
            {t("faq.empty", { defaultValue: "FAQ will be added soon." })}
          </div>
        )}
      </Accordion>
    </section>
  );
}
