import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-primary/5"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-health-green/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full animate-float">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          
          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-foreground">
            Take Control of Your 
            <span className="block text-primary">Health Today!</span>
          </h2>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-soft-gray max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who&apos;ve already discovered a better way to manage their health. 
            Start your journey to better healthcare now.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              variant="default" 
              size="lg"
              className="group shadow-strong"
              onClick={() => window.location.href = '/signup'}
            >
              Sign Up Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = '/login'}
            >
              Already have an account? Log In
            </Button>
          </div>
          
          {/* Benefits List */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 pt-8 text-soft-gray">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-health-green rounded-full"></div>
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-health-green rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-health-green rounded-full"></div>
              <span>Instant access</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-health-green rounded-full"></div>
              <span>Cancel anytime</span>
            </div>
          </div>
          
          {/* Urgency Text */}
          <p className="text-sm text-soft-gray font-medium italic">
            Your health can&apos;t wait. Start your better healthcare journey today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;