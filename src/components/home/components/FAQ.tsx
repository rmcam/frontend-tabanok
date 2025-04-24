import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "¿Qué es Tabanok?",
    answer: "Tabanok es una plataforma innovadora para aprender la lengua Kamëntsá de manera divertida y efectiva.",
  },
  {
    question: "¿Cómo puedo empezar a aprender Kamëntsá?",
    answer: "Puedes empezar creando una cuenta gratuita y explorando nuestras lecciones interactivas.",
  },
  {
    question: "¿Qué tipo de recursos ofrece Tabanok?",
    answer: "Ofrecemos lecciones interactivas, juegos, actividades y recursos multimedia para facilitar el aprendizaje.",
  },
];

const FAQ = () => {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-center mb-4">Preguntas Frecuentes</h2>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
