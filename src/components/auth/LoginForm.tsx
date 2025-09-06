"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleOAuthButton from "./GoogleOAuthButton";
import Logo from "../Logo";
import ThemeToggle from "../ThemeToggle";
import OTPVerification from "./OTPVerification";
import { signIn, getSession } from "next-auth/react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otpEmail, setOtpEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Check if it's an unverified email error
        if (result.error.includes("verify your email")) {
          setOtpEmail(data.email);
          setStep("otp");
        } else {
          setErrorMessage(result.error);
        }
      } else if (result?.ok) {
        // Get session for redirect logic
        const session = await getSession();

        if (session?.user.role === "DOCTOR") {
          if (session.user.needsProfileCompletion) {
            router.push("/auth/complete-profile");
          } else if (!session.user.isApproved) {
            router.push("/pending");
          } else {
            router.push("/dashboard");
          }
        } else {
          router.push("/bot");
        }
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleSignIn = () => {
    signIn("google");
  };

  // Handle OTP verification for unverified users
  if (step === "otp" && otpEmail) {
    return (
      <OTPVerification
        email={otpEmail}
        onVerified={() => {
          setStep("form");
          setOtpEmail(null);
          // Try login again after verification
          router.push("/auth/login");
        }}
        onBack={() => setStep("form")}
      />
    );
  }

  const onBack = () => router.push("/");
  const onSwitchToSignUp = () => router.push("/auth/signup");

  if (step === "otp" && otpEmail) {
    return (
      <OTPVerification
        email={otpEmail}
        onVerified={() => {
          setStep("form");
          setOtpEmail(null);
          reset();
        }}
        onBack={() => setStep("form")}
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-between p-2">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-0 text-muted-foreground hover:text-foreground focus-visible-ring"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <ThemeToggle />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="card-medical p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Logo />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Sign In to Your Account
              </h2>
              <p className="text-muted-foreground">
                Access your dashboard or chat with our health assistant
              </p>
            </div>

            {/* 👇 Two Google Buttons */}
            <GoogleOAuthButton
              onClick={handleGoogleSignIn}
              text="Continue with Google"
              className="w-full mb-6"
            />

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or sign in with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    className={`pl-10 ${
                      errors.email ? "border-destructive" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`pl-10 pr-10 ${
                      errors.password ? "border-destructive" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {errorMessage && (
              <div className="text-center mt-4">
                <p className="text-sm text-destructive font-medium">
                  {errorMessage}
                </p>
              </div>
            )}

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Don’t have an account?{" "}
                <button
                  onClick={onSwitchToSignUp}
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  Sign Up
                </button>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                🔒 Your data is protected with end-to-end encryption
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
