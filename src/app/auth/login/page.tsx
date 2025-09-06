/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import GoogleOAuthButton from "@/components/auth/GoogleOAuthButton";
import OTPVerification from "@/components/auth/OTPVerification";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { signIn, getSession } from "next-auth/react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otpEmail, setOtpEmail] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const callbackUrl =
    searchParams.get("callbackUrl") || "/auth/redirect-handler";

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("verify your email")) {
          setOtpEmail(data.email);
          setStep("otp");
          toast.error("Please verify your email to continue.");
        } else {
          toast.error(result.error || "Invalid email or password.");
        }
      } else {
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
    } catch (err: any) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (role: "PATIENT" | "DOCTOR") => {
    document.cookie = `intended-role=${role}; path=/; max-age=3600`;
    await signIn("google", { callbackUrl });
  };

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
          toast.success("Email verified! Please log in.");
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
          className="text-muted-foreground hover:text-foreground focus-visible-ring"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <ThemeToggle />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <Card className="card-medical p-8 w-full max-w-md animate-fade-in">
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

          <div className="space-y-4">
            <GoogleOAuthButton
              onClick={() => handleGoogleSignIn("PATIENT")}
              text="Sign in as Patient with Google"
              className="w-full"
            />
            <GoogleOAuthButton
              onClick={() => handleGoogleSignIn("DOCTOR")}
              text="Sign in as Doctor with Google"
              className="w-full"
            />
          </div>

          <div className="relative my-6">
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
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
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
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus-visible-ring"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <a
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary/80 focus-visible-ring"
              >
                Forgot your password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-6 focus-visible-ring"
            >
              {isLoading ? (
                <>
                  <div className="loading-pulse w-4 h-4 rounded mr-2"></div>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <button
                onClick={onSwitchToSignUp}
                className="text-primary hover:text-primary/80 font-semibold focus-visible-ring"
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
    </>
  );
}
