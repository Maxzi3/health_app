/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import GoogleOAuthButton from "@/components/auth/GoogleOAuthButton";
import OTPVerification from "@/components/auth/OTPVerification";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { signIn } from "next-auth/react";

const signUpSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["PATIENT", "DOCTOR"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"role" | "form" | "otp">("role");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState<
    "PATIENT" | "DOCTOR" | null
  >(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "PATIENT",
    },
  });

  const handleRoleSelect = (role: "PATIENT" | "DOCTOR") => {
    setValue("role", role);
    setStep("form");
  };

  const handleGoogleSignup = async (role: "PATIENT" | "DOCTOR") => {
    setGoogleLoading(role);
    document.cookie = `intended-role=${role}; path=/; max-age=3600`;
    await signIn("google", {
      callbackUrl: "/auth/redirect-handler",
    });
    setGoogleLoading(null);
  };

  const onBack = () => router.push("/");

  const onSwitchToLogin = () => router.push("/auth/login");

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Signup failed");
      }

      toast.success(result.message || "Account created successfully!");
      setTimeout(() => {
        setStep("otp");
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleOtpVerified = async () => {
    try {
      const signInResult = await signIn("credentials", {
        email: getValues("email"),
        password: getValues("password"),
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error("Login failed after signup");
      }

      toast.success("Email verified successfully!");
      router.push("/auth/redirect-handler");
    } catch (err: any) {
      toast.error(err.message || "Login failed after signup");
    }
  };

  if (step === "role") {
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
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="card-medical p-8 w-full max-w-md animate-fade-in">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Logo />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Choose Your Role
              </h2>
              <p className="text-muted-foreground">
                Select how you want to join
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => handleRoleSelect("PATIENT")}
                className="w-full btn-primary focus-visible-ring"
              >
                Join as Patient
              </Button>
              <Button
                onClick={() => handleRoleSelect("DOCTOR")}
                variant="outline"
                className="w-full focus-visible-ring"
              >
                Join as Doctor
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with Google
                </span>
              </div>
            </div>

            <GoogleOAuthButton
              onClick={() => handleGoogleSignup("PATIENT")}
              text="Sign up as Patient with Google"
              className="w-full"
              loading={googleLoading === "PATIENT"}
            />

            <GoogleOAuthButton
              onClick={() => handleGoogleSignup("DOCTOR")}
              text="Sign up as Doctor with Google"
              className="w-full"
              loading={googleLoading === "DOCTOR"}
            />
          </Card>
        </div>
      </>
    );
  }

  if (step === "form") {
    return (
      <>
        <div className="flex items-center justify-between p-2">
          <Button
            onClick={() => setStep("role")}
            variant="ghost"
            className="mb-0 text-muted-foreground hover:text-foreground focus-visible-ring"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to role selection
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
                Create Your {getValues("role").toLowerCase()} Account
              </h2>
              <p className="text-muted-foreground">
                Get started with your {getValues("role").toLowerCase()} account
              </p>
            </div>

            <GoogleOAuthButton
              onClick={() => handleGoogleSignup(getValues("role"))}
              text={`Sign up with Google as ${getValues("role").toLowerCase()}`}
              className="w-full mb-6"
            />

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    {...register("name")}
                    className={`pl-10 ${
                      errors.name ? "border-destructive" : ""
                    }`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                </div>
                {errors.name && (
                  <p id="name-error" className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                    placeholder="Create a strong password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...register("confirmPassword")}
                    className={`pl-10 pr-10 ${
                      errors.confirmPassword ? "border-destructive" : ""
                    }`}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={
                      errors.confirmPassword
                        ? "confirmPassword-error"
                        : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus-visible-ring"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p
                    id="confirmPassword-error"
                    className="text-sm text-destructive"
                  >
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full mt-6 focus-visible-ring"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={onSwitchToLogin}
                  className="text-primary hover:text-primary/80 font-semibold focus-visible-ring"
                >
                  Sign In
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

  if (step === "otp") {
    return (
      <OTPVerification
        email={getValues("email")}
        onVerified={handleOtpVerified}
        onBack={() => setStep("form")}
      />
    );
  }

  return null;
}
