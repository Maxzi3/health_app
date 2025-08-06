"use client";

import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Users,
  HeartPulse,
  ShieldCheck,
  Globe2,
} from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const team = [
    {
      name: "Dr. Jane Thompson",
      role: "Chief Medical Officer",
      image: "/images/team1.jpg",
    },
    {
      name: "David Li",
      role: "Head of Engineering",
      image: "/images/team2.jpg",
    },
    {
      name: "Amira Khan",
      role: "Lead Product Designer",
      image: "/images/team3.jpg",
    },
    {
      name: "Michael Brown",
      role: "AI Research Lead",
      image: "/images/team4.jpg",
    },
  ];

  return (
    <main className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold my-6">
            About <span className="text-primary">Medify</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            We’re on a mission to make healthcare more accessible, personalized,
            and secure — for everyone, everywhere.
          </p>
          <Button size="lg" variant="default" className="gap-2">
            Get Started <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Image
              src="/images/Aboutimg.png"
              alt="Healthcare mission illustration"
              width={600}
              height={400}
              className="rounded-xl object-cover shadow-soft"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Medify started with a simple idea: healthcare should be easy to
              access, secure, and available 24/7. We leverage AI-powered triage
              and secure telemedicine tools to bridge the gap between patients
              and healthcare professionals — all at the tap of a button.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our team is passionate about creating technology that saves lives
              and gives peace of mind to families, healthcare providers, and
              businesses worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-3">
            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="p-8 text-center space-y-4">
                <Users className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Patient First</h3>
                <p className="text-muted-foreground">
                  Everything we do is built around improving the patient
                  experience and ensuring quality care.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="p-8 text-center space-y-4">
                <ShieldCheck className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Data Security</h3>
                <p className="text-muted-foreground">
                  We follow HIPAA, SOC 2, and industry-leading security
                  practices to keep patient data safe and secure.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="p-8 text-center space-y-4">
                <HeartPulse className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Innovation</h3>
                <p className="text-muted-foreground">
                  From AI-powered triage to instant video consultations, we push
                  the boundaries of what digital healthcare can do.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Meet Our Team</h2>
          <div className="grid gap-8 md:gap-3 md:grid-cols-4">
            {team.map((member, index) => (
              <Card
                key={index}
                className="shadow-soft hover:shadow-medium transition-shadow"
              >
                <CardContent className="p-6 flex flex-col items-center space-y-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={150}
                    height={150}
                    className="rounded-full object-cover border-4 border-primary/20"
                  />
                  <div>
                    <p className="font-semibold text-lg">{member.name}</p>
                    <p className="text-muted-foreground">{member.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Global Impact */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl text-center space-y-6">
          <Globe2 className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-3xl font-bold">A Global Reach</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Today, Medify is trusted by patients and providers across
            multiple countries, providing accessible healthcare solutions to
            urban centers and rural communities alike.
          </p>
          <Button size="lg" variant="outline">
            Join Our Journey
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-background text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to experience better healthcare?
        </h2>
        <Button
          size="lg"
          variant="secondary"
          className="bg-background text-primary hover:bg-background/90"
        >
          Create Your Account
        </Button>
      </section>
      <Footer />
    </main>
  );
}
