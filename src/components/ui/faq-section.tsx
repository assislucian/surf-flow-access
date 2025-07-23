import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "Wie erhalte ich meinen Zugangs-PIN?",
      answer: "Nach erfolgreicher Bezahlung erhältst du automatisch eine E-Mail mit deinem persönlichen PIN-Code. Dieser PIN ist nur für deine gebuchte Zeit gültig."
    },
    {
      question: "Kann ich meine Buchung stornieren?",
      answer: "Ja, Buchungen können bis zu 24 Stunden vor dem gebuchten Termin kostenfrei storniert werden. Bei späteren Stornierungen behalten wir 50% der Buchungsgebühr ein."
    },
    {
      question: "Welche Ausrüstung ist im Preis enthalten?",
      answer: "Alle notwendige Schutzausrüstung (Helm, Knieschützer, Handgelenkschützer) sowie Surfboard oder Skateboard sind im Preis enthalten. Du musst nur Sportkleidung mitbringen."
    },
    {
      question: "Gibt es eine Altersgrenze?",
      answer: "Kinder ab 8 Jahren sind in Begleitung eines Erwachsenen willkommen. Ab 16 Jahren ist eigenständiges Surfen und Skaten erlaubt. Für Kinder unter 16 Jahren ist eine Einverständniserklärung der Eltern erforderlich."
    },
    {
      question: "Was passiert, wenn ich zu spät komme?",
      answer: "Deine gebuchte Zeit verkürzt sich entsprechend deiner Verspätung. Eine Verlängerung ist nur möglich, wenn der nächste Zeitslot frei ist. Wir empfehlen, 15 Minuten vor deiner Session zu erscheinen."
    },
    {
      question: "Kann ich Termine spontan buchen?",
      answer: "Ja, spontane Buchungen sind möglich, sofern freie Plätze verfügbar sind. Wir empfehlen jedoch eine Vorab-Buchung, besonders an Wochenenden und Feiertagen."
    },
    {
      question: "Welche Zahlungsmethoden werden akzeptiert?",
      answer: "Wir akzeptieren alle gängigen Kreditkarten, PayPal sowie SEPA-Lastschrift. Die Zahlung erfolgt sicher über unsere verschlüsselten Payment-Partner."
    },
    {
      question: "Ist Anfänger-Training verfügbar?",
      answer: "Ja, wir bieten regelmäßig Anfängerkurse für Surf und Skate an. Diese können separat gebucht werden und beinhalten professionelle Anleitung sowie extra Übungszeit."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Häufige Fragen
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Alles was du über deine Session wissen musst
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 hover:shadow-energy transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};