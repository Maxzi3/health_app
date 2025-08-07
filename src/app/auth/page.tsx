"use client";
import { ArrowLeft, UserCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const RoleSelection = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between p-2">
        {/* Back Button */}
        <Button
          onClick={() => router.push("/")}
          variant="ghost"
          className="mb-0 text-muted-foreground hover:text-foreground focus-visible-ring"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <ThemeToggle />
      </div>
      <div className="min-h-screen  flex items-center justify-center px-4">
        <div className="w-full max-w-2xl animate-fade-in">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Choose Your Role
            </h2>
            <p className="text-lg text-muted-foreground">
              Select how you&apos;d like to use HealthConnect
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className="card-medical p-8 cursor-pointer group hover:-translate-y-2 transition-all duration-300"
              onClick={() => router.push("/auth/signup/patient")}
            >
              <div className="text-center">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <UserCheck className="h-12 w-12 text-primary" />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-4">
                  I&apos;m a Patient
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Access AI health triage, book appointments, and connect with
                  healthcare professionals for consultations.
                </p>

                <div className="space-y-2 text-sm text-muted-foreground text-left">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                    Instant AI health assessments
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                    Video consultations with doctors
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                    Secure health record management
                  </div>
                </div>
              </div>
            </Card>

            <Card
              className="card-medical p-8 cursor-pointer group hover:-translate-y-2 transition-all duration-300"
              onClick={() => router.push("/auth/signup/doctor")}
            >
              <div className="text-center">
                <div className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Stethoscope className="h-12 w-12 text-primary" />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-4">
                  I&apos;m a Doctor
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Join our network of verified healthcare professionals and
                  provide consultations to patients worldwide.
                </p>

                <div className="space-y-2 text-sm text-muted-foreground text-left">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3"></div>
                    Conduct secure video consultations
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3"></div>
                    Manage patient appointments
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3"></div>
                    Access comprehensive patient data
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Security Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              🔒 Your data is protected with enterprise-grade security and
              complete privacy
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleSelection;
