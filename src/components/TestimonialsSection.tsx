"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

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
    {
      name: "Dr. James Patel",
      role: "Physician",
      content:
        "As a doctor, I trust this app for its accuracy and ease of use. It’s a game-changer for both patients and providers.",
      rating: 5,
      avatar: "👨‍⚕️",
    },
    {
      name: "Emily Carter",
      role: "Parent",
      content:
        "The video consultations are so easy to use, and I feel confident my data is secure. It’s perfect for my family’s needs!",
      rating: 5,
      avatar: "👩‍👧",
    },
  ];

  const patientImages = [
    { src: "/images/patient1.jpeg", alt: "Happy patient Sarah" },
    { src: "/images/patient2.jpg", alt: "Satisfied patient Michael" },
    { src: "/images/patient3.jpg", alt: "Smiling patient Robert" },
    { src: "/images/patient4.jpg", alt: "Content patient Lisa" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const handleNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section
      className="py-12 sm:py-20"
      role="region"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Left Side - Testimonials */}
          <div className="flex-1 max-w-2xl">
            <div className="mb-12">
              <h2
                id="testimonials-heading"
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
              >
                What Our <span className="text-primary">Users Say</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-500 leading-relaxed">
                Real stories from people who&apos;ve transformed their
                healthcare experience.
              </p>
            </div>

            {/* Testimonials Carousel */}
            <Card className="border-0 rounded-xl shadow-medium hover:shadow-lg bg-gradient-to-br bg-primary/5 backdrop-blur-sm mb-6 transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="space-y-4">
                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Testimonial Content */}
                  <p className="text-lg  leading-relaxed italic">
                    &quot;{testimonials[currentTestimonial].content}&quot;
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {testimonials[currentTestimonial].avatar}
                      </div>
                      <div>
                        <p className="font-semibold ">
                          {testimonials[currentTestimonial].name}
                        </p>
                        <p className="text-gray-500">
                          {testimonials[currentTestimonial].role}
                        </p>
                      </div>
                    </div>
                    {/* Navigation Arrows */}
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrev}
                        aria-label="Previous testimonial"
                        className="p-2 rounded-full bg-primary text-secondary hover:bg-green-600 transition-colors duration-300"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleNext}
                        aria-label="Next testimonial"
                        className="p-2 rounded-full bg-primary text-secondary  hover:bg-green-600 transition-colors duration-300"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Patient Images */}
          <div className="flex-1 max-w-lg">
            <div className="grid grid-cols-2  gap-4">
              {patientImages.map((patient, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl shadow-soft hover:shadow-medium transition-shadow duration-300"
                >
                  <Image
                    src={patient.src}
                    alt={patient.alt}
                    width={250}
                    height={250}
                    className="object-cover hover:scale-105 transition-transform duration-300 rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
