import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PricingSection = () => {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for occasional health consultations",
      features: [
        "AI symptom checker",
        "1 video consultation per month",
        "Basic health tracking",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Premium",
      price: "$29",
      period: "/month",
      description: "Ideal for regular health monitoring",
      features: [
        "Unlimited AI symptom checks",
        "5 video consultations per month",
        "Priority booking",
        "Advanced health analytics",
        "24/7 chat support",
        "Prescription management",
      ],
      popular: true,
    },
    {
      name: "Family",
      price: "$49",
      period: "/month",
      description: "Complete healthcare for your entire family",
      features: [
        "Everything in Premium",
        "Up to 6 family members",
        "Unlimited consultations",
        "Family health dashboard",
        "Dedicated family doctor",
        "Emergency consultations",
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Choose Your Health Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible pricing options to fit your healthcare needs and budget
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-4 max-w-6xl mx-auto ">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-health-green flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.price === "Free" ? "Get Started" : "Choose Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
