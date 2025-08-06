import { Shield, Lock, Eye, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SecuritySection = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description:
        "Full compliance with HIPAA regulations ensuring your medical data is protected according to the highest healthcare standards.",
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description:
        "All communications and data are encrypted using AES-256 encryption, the same standard used by banks and government agencies.",
    },
    {
      icon: Eye,
      title: "Zero-Knowledge Architecture",
      description:
        "We can't see your personal health data. Our zero-knowledge system ensures only you and your healthcare provider have access.",
    },
    {
      icon: CheckCircle,
      title: "SOC 2 Certified",
      description:
        "Our security controls are audited and certified by independent third parties to meet the highest industry standards.",
    },
  ];

  const certifications = [
    {
      name: "HIPAA",
      description: "Health Insurance Portability and Accountability Act",
    },
    { name: "SOC 2", description: "Service Organization Control 2" },
    {
      name: "ISO 27001",
      description: "International Organization for Standardization",
    },
    { name: "GDPR", description: "General Data Protection Regulation" },
  ];

  return (
    <section id="security" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Security is Our Priority
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We understand that healthcare data is deeply personal. That&apos;s why
            we&apos;ve built our platform with security and privacy at its core,
            using enterprise-grade protection to keep your information safe.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {securityFeatures.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-card rounded-lg p-8">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">
            Certifications & Compliance
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div key={cert.name} className="text-center">
                <div className="w-16 h-16 bg-health-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-health-green" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  {cert.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our security practices? Our security team is
            available to discuss our protocols and compliance measures. Contact
            us for a detailed security overview.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
