'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Working Mother",
      content:
        "This app saved me time and stress! I was able to get quick guidance on my child's symptoms at 2 AM and connect with a doctor immediately.",
      rating: 5,
      avatar: "👩‍💼",
    },
    {
      name: "Michael Chen",
      role: "Business Executive",
      content:
        "The AI triage feature is incredible. It helped me understand my symptoms better before my consultation, making the appointment more efficient.",
      rating: 5,
      avatar: "👨‍💼",
    },
    {
      name: "Lisa Rodriguez",
      role: "Teacher",
      content:
        "Finally, healthcare that fits my schedule! The 24/7 access means I can get care when I need it, not just when it's convenient for providers.",
      rating: 5,
      avatar: "👩‍🏫",
    },
  ];

  const partnerLogos = [
    { name: "HIPAA", badge: "🛡️ HIPAA Compliant" },
    { name: "AMA", badge: "🏥 AMA Endorsed" },
    { name: "FDA", badge: "✅ FDA Cleared" },
    { name: "Security", badge: "🔒 ISO 27001" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-calm-blue/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Our <span className="text-primary">Users Say</span>
          </h2>
          <p className="text-xl text-soft-gray max-w-2xl mx-auto">
            Real stories from people who&apos;ve transformed their healthcare
            experience.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-medium bg-background/90 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="text-center space-y-6">
                {/* Quote Icon */}
                <Quote className="w-12 h-12 text-primary/30 mx-auto" />

                {/* Testimonial Content */}
                <div className="space-y-4">
                  <p className="text-lg md:text-xl text-foreground leading-relaxed italic">
                    &quot;{testimonials[currentTestimonial].content}&quot;
                  </p>

                  {/* Rating */}
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-3xl">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">
                        {testimonials[currentTestimonial].name}
                      </p>
                      <p className="text-soft-gray">
                        {testimonials[currentTestimonial].role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? "bg-primary" : "bg-primary/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="text-center">
          <p className="text-soft-gray mb-8 font-medium">
            Trusted & Certified by:
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {partnerLogos.map((partner, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-background/60 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors"
              >
                <span className="text-lg">{partner.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
