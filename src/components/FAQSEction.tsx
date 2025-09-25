import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSEction = () => {
  const faqs = [
    {
      question: "How does the AI triage system work?",
      answer:
        "Our AI triage system analyzes your symptoms using advanced machine learning algorithms trained on medical data. It asks relevant questions about your condition and provides initial assessments to help determine the urgency of your situation and connect you with the right healthcare professional.",
    },
    {
      question: "Is my health data secure and HIPAA compliant?",
      answer:
        "Yes, absolutely. We are fully HIPAA compliant and use enterprise-grade encryption to protect your health information. All data is encrypted both in transit and at rest, and we never share your personal health information without your explicit consent.",
    },
    {
      question: "Can I get prescriptions through Appointment?",
      answer:
        "Yes, licensed healthcare providers on our platform can prescribe medications during video consultations when medically appropriate. Prescriptions are sent directly to your preferred pharmacy, and you'll receive notifications when they're ready for pickup.",
    },
    {
      question: "What types of medical conditions can be treated virtually?",
      answer:
        "Our platform is ideal for non-emergency conditions such as cold and flu symptoms, minor injuries, skin conditions, mental health consultations, follow-up appointments, and routine check-ins. For emergencies or conditions requiring physical examination, we'll direct you to in-person care.",
    },
    {
      question: "How quickly can I connect with a healthcare provider?",
      answer:
        "Most consultations are available within minutes during business hours, and we have providers available 24/7 for urgent concerns. Our AI triage helps prioritize cases, ensuring you get timely care based on the severity of your condition.",
    },
    {
      question: "What insurance plans do you accept?",
      answer:
        "We accept most major insurance plans including Blue Cross Blue Shield, Aetna, Cigna, UnitedHealth, and many others. You can verify your coverage during registration, and we also offer affordable self-pay options for uninsured patients.",
    },
    {
      question: "Can I use the app for my family members?",
      answer:
        "Yes, you can create profiles for family members and schedule appointments on their behalf. For minors, a parent or guardian must be present during the consultation. Each family member's health information is kept separate and secure.",
    },
    {
      question: "What if I need follow-up care after my consultation?",
      answer:
        "Follow-up care is seamlessly integrated into our platform. Your provider can schedule follow-up appointments, send additional instructions, or refer you to specialists if needed. All your medical records and consultation history are maintained in one secure location.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Find answers to common questions about our healthcare platform and
            services
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 py-2 bg-card"
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

export default FAQSEction;
