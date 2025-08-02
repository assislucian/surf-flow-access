import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const { t } = useTranslation();

  const faqItems = [
    {
      question: t("faq.whatIsSurfskate.question", { defaultValue: "Was ist Surfskating?" }),
      answer: t("faq.whatIsSurfskate.answer", { 
        defaultValue: "Surfskating ist eine innovative Art des Skatens, die das Surfen auf der Straße simuliert. Mit speziellen Boards und Trucks können Sie die fließenden Bewegungen des Surfens erleben." 
      })
    },
    {
      question: t("faq.howToBook.question", { defaultValue: "Wie kann ich eine Session buchen?" }),
      answer: t("faq.howToBook.answer", { 
        defaultValue: "Wählen Sie einfach Ihr gewünschtes Datum und Ihre Uhrzeit aus, überprüfen Sie die Zusammenfassung und bezahlen Sie sicher online. Sie erhalten eine Bestätigungs-E-Mail mit allen Details." 
      })
    },
    {
      question: t("faq.cancellation.question", { defaultValue: "Kann ich meine Buchung stornieren?" }),
      answer: t("faq.cancellation.answer", { 
        defaultValue: "Ja, Sie können Ihre Buchung bis zu 24 Stunden vor der geplanten Session kostenlos stornieren. Besuchen Sie einfach Ihr Dashboard und klicken Sie auf 'Stornieren'." 
      })
    },
    {
      question: t("faq.equipment.question", { defaultValue: "Ist Equipment inbegriffen?" }),
      answer: t("faq.equipment.answer", { 
        defaultValue: "Ja, alle notwendigen Surfskate-Boards und Schutzausrüstung sind im Preis enthalten. Bringen Sie einfach bequeme Kleidung und Sportschuhe mit." 
      })
    }
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          {t("faq.title", { defaultValue: "Häufig gestellte Fragen" })}
        </h2>
        <p className="text-muted-foreground">
          {t("faq.subtitle", { defaultValue: "Alles was Sie über unsere Surfskate-Sessions wissen müssen" })}
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export default FAQSection;