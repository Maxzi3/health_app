"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HeartPulse } from "lucide-react";
import Link from "next/link";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative py-20 lg:mx-10 mx-auto sm:py-28"
      role="region"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-16">
        {/* Text Content */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
            <HeartPulse className="w-4 h-4" />
            Who We Are
          </div>

          <h2
            id="about-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold "
          >
            Empowering <span className="text-primary">Healthcare Access</span>{" "}
            for Everyone
          </h2>

          <p className="text-lg leading-relaxed ">
            We believe healthcare should be simple, fast, and accessible. Our
            AI-powered triage and secure telemedicine platform connect patients
            with trusted doctors anytime, anywhere. Whether it’s a midnight
            fever or a quick follow-up, we’re here to make quality care only one
            tap away.
          </p>

          <p className="text-lg leading-relaxed ">
            Built by clinicians and engineers, our mission is to remove
            traditional barriers to healthcare and put you back in control of
            your well-being.
          </p>

          <div className="pt-4">
            <Link href="/about">
              <Button size="lg" className="shadow-medium">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Image / Illustration */}
        <div className="flex-1  relative md:left-20 lg:left-0  w-full h-80 sm:h-[500px] ">
          <Image
            src="/images/our-impact-csr.webp"
            alt="Healthcare professionals collaborating"
            width={500}
            height={300}
            className="object-cover rounded-2xl"
          />
          {/* <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div> */}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
