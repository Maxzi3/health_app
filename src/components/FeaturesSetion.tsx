import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, Video, Calendar } from "lucide-react";


const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Triage",
      description:
        "Our advanced AI assesses your symptoms instantly, providing quick guidance and helping prioritize your care needs.",
      details: "Get preliminary health insights in seconds, not hours.",
    },
    {
      icon: Video,
      title: "Secure Video Calls",
      description:
        "Connect with licensed healthcare professionals through encrypted, HIPAA-compliant video consultations.",
      details: "Your privacy and security are our top priorities.",
    },
    {
      icon: Calendar,
      title: "Easy Booking",
      description:
        "Schedule appointments seamlessly with our intuitive booking system that works around your schedule.",
      details: "Find available slots that work for you, 24/7.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose Our <span className="text-primary">Health App</span>?
          </h2>
          <p className="text-xl text-soft-gray max-w-2xl mx-auto">
            Experience healthcare that adapts to your life with cutting-edge
            technology and compassionate care.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-2 border-0 shadow-soft bg-card/50 backdrop-blur-sm"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 relative">
                  {/* Background Image */}
                  <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden mb-4 group-hover:scale-110 transition-transform duration-300"></div>
                  {/* Icon Overlay */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 p-4 bg-primary rounded-full flex items-center justify-center">
                    <feature.icon className=" text-primary-foreground w-10 h-10 mx-auto  overflow-hidden group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <CardDescription className="text-soft-gray leading-relaxed">
                  {feature.description}
                </CardDescription>
                <p className="text-sm font-medium text-primary">
                  {feature.details}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
