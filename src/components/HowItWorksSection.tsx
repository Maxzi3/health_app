import { CheckCircle, ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Check Symptoms",
      description:
        "Use our AI triage tool to evaluate your symptoms and get instant preliminary guidance.",
      color: "bg-primary",
    },
    {
      number: "02",
      title: "Book Doctor",
      description:
        "Select from our network of licensed healthcare professionals and schedule at your convenience.",
      color: "bg-health-green",
    },
    {
      number: "03",
      title: "Consultation",
      description:
        "Connect securely and get either a Prescription or Book an Appointment with them ",
      color: "bg-trust-blue",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 ">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-lg text-soft-gray max-w-2xl mx-auto">
            Get the care you need in three simple steps. It&apos;s that easy.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between mb-12">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-medium`}
                  >
                    {step.number}
                  </div>
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-8">
                    <div className="h-0.5 bg-primary/30 relative">
                      <div className="absolute inset-0 bg-primary/60 animate-pulse"></div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-primary mx-auto -mt-3 bg-background rounded-full p-1" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Step Details */}
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                {/* Mobile Number Circle */}
                <div
                  className={`md:hidden w-16 h-16 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-medium`}
                >
                  {step.number}
                </div>

                <h3 className="text-2xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-soft-gray leading-relaxed">
                  {step.description}
                </p>

                {/* Success Indicator */}
                <div className="flex items-center justify-center gap-2 text-health-green">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Quick & Secure</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
