import AboutSection from "@/components/AboutSection";
import BlogSection from "@/components/BlogSection";
import FeaturesSection from "@/components/FeaturesSetion";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PricingSection from "@/components/PricingSection";
import SecuritySection from "@/components/SecuritySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";

const page = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection/>
      <HowItWorksSection/>
      <WhyChooseUsSection/>
      <TestimonialsSection/>
      <PricingSection/>
      <AboutSection/>
      <SecuritySection/>
      <BlogSection/>
      <Footer/>
    </>
  );
};

export default page;
