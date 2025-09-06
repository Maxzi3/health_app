"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-calm-blue">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpeg"
          alt="Modern healthcare technology interface"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/40" aria-hidden="true"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Floating Icon */}
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full animate-float">
            <Heart className="w-8 h-8 text-primary" aria-hidden="true" />
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in">
            Your Health, <span className="text-primary">One Tap Away</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-lg lg:text-xl text-gray-100 max-w-2xl mx-auto animate-fade-in">
            Connect with healthcare professionals instantly through our
            AI-powered triage system and secure video consultations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button
              variant="hero"
              size="xl"
              className="group shadow-lg"
              onClick={() => router.push("/bot")}
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline-hero"
              size="xl"
              className="shadow-lg border-white/50 text-primary hover:bg-white/10"
              onClick={() => router.push("/auth/login")}
            >
              Log In
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-200 animate-fade-in">
            {["HIPAA Compliant", "End-to-End Encrypted", "24/7 Available"].map(
              (text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-health-green rounded-full"></div>
                  <span>{text}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-300 animate-bounce"
        aria-hidden="true"
      >
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-300 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
