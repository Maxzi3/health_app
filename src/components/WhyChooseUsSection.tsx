import { Shield, Clock, Award } from "lucide-react";

const WhyChooseUsSection = () => {
  const benefits = [
    {
      icon: Award,
      title: "Trusted by Experts",
      description:
        "Developed with input from leading physicians and medical professionals to ensure the highest standards of care.",
      highlight: "Medical Professional Endorsed",
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description:
        "Round-the-clock availability for symptom checks and consultations. Healthcare shouldn't wait for business hours.",
      highlight: "Always Available",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "End-to-end encryption and full HIPAA compliance ensure your health data stays private and secure.",
      highlight: "Bank-Level Security",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose <span className="text-primary">Medify</span>?
          </h2>
          <p className="text-xl text-soft-gray max-w-2xl mx-auto">
            Experience healthcare built on trust, accessibility, and
            cutting-edge security standards.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-0 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group text-center space-y-6 p-8 rounded-2xl hover:bg-primary/5  transition-all duration-300 hover:shadow-soft"
            >
              {/* Icon */}
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <benefit.icon className="w-8 h-8 text-primary" />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>

                <p className="text-soft-gray leading-relaxed ">
                  {benefit.description}
                </p>

                {/* Highlight Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-health-green/10 text-health-green rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-health-green rounded-full"></div>
                  {benefit.highlight}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-primary/5 rounded-2xl border border-primary/10">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Ready to Experience Better Healthcare?
          </h3>
          <p className="text-soft-gray mb-6 max-w-md mx-auto">
            Join thousands of users who trust us with their health and wellness
            journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-soft-gray">
            <span>✓ No subscription fees</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Instant access</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
