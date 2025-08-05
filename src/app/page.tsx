import FeaturesSection from "@/components/FeaturesSetion";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";

const page = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection/>
      <HowItWorksSection/>
      <WhyChooseUsSection/>
      <TestimonialsSection/>
    </>
  );
};

export default page;
