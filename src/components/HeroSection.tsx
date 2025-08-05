"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-calm-blue">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {/* <img
          src={heroImage}
          alt="Modern healthcare technology"
          className="w-full h-full object-cover opacity-20"
        /> */}
        <div className="absolute inset-0 bg-calm-blue/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Floating Icon */}
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full animate-float">
            <Heart className="w-8 h-8 text-primary" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in">
            Your Health, <span className="text-primary">One Tap Away</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-soft-gray mb-8 max-w-2xl mx-auto animate-fade-in">
            Connect with healthcare professionals instantly through our
            AI-powered triage system and secure video consultations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button
              variant="hero"
              size="xl"
              className="group"
              onClick={() => (window.location.href = "/signup")}
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline-hero"
              size="xl"
              onClick={() => (window.location.href = "/login")}
            >
              Log In
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-soft-gray animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-health-green rounded-full"></div>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-health-green rounded-full"></div>
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-health-green rounded-full"></div>
              <span>24/7 Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-soft-gray animate-bounce">
        <div className="w-6 h-10 border-2 border-soft-gray rounded-full flex justify-center">
          <div className="w-1 h-3 bg-soft-gray rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
