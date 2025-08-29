"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  FileText,
  Eye,
  EyeOff,
  Upload,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleOAuthButton from "./GoogleOAuthButton";
import OTPVerification from "./OTPVerification";
import Logo from "../Logo";
import ThemeToggle from "../ThemeToggle";
import { useRouter } from "next/navigation";

/* ------------------------- Validation Schema ------------------------- */
const signUpSchema = z
  .object({
    role: z.enum(["PATIENT", "DOCTOR"]),
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    specialization: z.string().optional(),
    licenseFile: z.instanceof(File).optional().or(z.null()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.role === "PATIENT" || !!data.specialization, {
    message: "Specialization is required for doctors",
    path: ["specialization"],
  })
  .refine(
    (data) =>
      data.role === "PATIENT" ||
      (data.licenseFile &&
        ["application/pdf", "image/jpeg", "image/png"].includes(
          data.licenseFile.type
        ) &&
        data.licenseFile.size <= 5 * 1024 * 1024), // 5MB limit
    {
      message: "License file is required for doctors (PDF, JPG, PNG, max 5MB)",
      path: ["licenseFile"],
    }
  );

type SignUpFormData = z.infer<typeof signUpSchema>;

/* ------------------------- Component Props ------------------------- */
interface SignUpFormProps {
  role: "PATIENT" | "DOCTOR";
}

/* ------------------------- Component ------------------------- */
const SignUpForm: React.FC<SignUpFormProps> = ({ role }) => {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp" | "pending">("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpEmail, setOtpEmail] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { role },
  });

  /* ------------------------- Handlers ------------------------- */
  const onBack = () => router.push("/");
  const onSwitchToLogin = () => router.push("/auth/login");

  // const onSubmit = async (data: SignUpFormData) => {
  //   console.log("Form Data:", data);
  // }
  const onSubmit = async (data: SignUpFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);

      if (data.role === "DOCTOR") {
        if (data.specialization) {
          formData.append("specialization", data.specialization);
        }
        if (data.licenseFile) {
          formData.append("cv", data.licenseFile);
        }
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Signup failed");
      }

      // Display success message briefly before OTP step
      setSuccessMessage(responseData.message || "Please verify your email");
      setOtpEmail(data.email);
      setTimeout(() => {
        setSuccessMessage("");
        setStep("otp");
      }, 2000); // 2-second delay for UX
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong");
    }
  };

  const handleOTPVerified = () => {
    if (role === "DOCTOR") {
      setStep("pending");
    } else {
      router.push("/auth/login");
    }
  };

  const handleGoogleAuth = () => {
    signIn("google", { callbackUrl: `/auth/callback?role=${role}` });
  };

  /* ------------------------- Step: OTP ------------------------- */
  if (step === "otp" && otpEmail) {
    return (
      <OTPVerification
        email={otpEmail}
        onVerified={handleOTPVerified}
        onBack={() => setStep("form")}
      />
    );
  }

  /* ------------------------- Step: Pending (doctor) ------------------------- */
  if (step === "pending") {
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
          <Card className="card-medical p-8 w-full max-w-md text-center animate-fade-in">
            <div className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl w-fit mx-auto mb-6">
              <FileText className="h-12 w-12 text-secondary" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">
              Account Under Review
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Thank you for registering as a healthcare professional. Your
              account and credentials are under review. You will receive an
              email notification once approved by our admin team.
            </p>

            <div className="bg-accent p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground">
                ✅ Email verified
                <br />
                🔍 Credentials under review
                <br />
                📧 Approval notification pending
              </p>
            </div>

            <Button
              onClick={onBack}
              variant="outline"
              className="w-full focus-visible-ring"
            >
              Back to Home
            </Button>
          </Card>
        </div>
      </>
    );
  }

  /* ------------------------- Step: Form ------------------------- */
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
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Logo />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                {role === "PATIENT"
                  ? "Join Your Health Journey"
                  : "Join Our Medical Network"}
              </h2>
              <p className="text-muted-foreground">
                Create your {role.toLowerCase()} account to get started
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="text-center mb-6">
                <p className="text-sm text-green-500 font-medium flex items-center justify-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {successMessage}
                </p>
              </div>
            )}

            {/* Google OAuth */}
            <GoogleOAuthButton
              onClick={handleGoogleAuth}
              text={`Sign up with Google as ${role.toLowerCase()}`}
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

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    {...register("fullName")}
                    className={`pl-10 ${
                      errors.fullName ? "border-destructive" : ""
                    }`}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={
                      errors.fullName ? "fullName-error" : undefined
                    }
                  />
                </div>
                {errors.fullName && (
                  <p id="fullName-error" className="text-sm text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
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

              {/* Password */}
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

              {/* Confirm Password */}
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

              {/* Doctor-specific fields */}
              {role === "DOCTOR" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      placeholder="e.g., Cardiologist"
                      {...register("specialization")}
                      className={
                        errors.specialization ? "border-destructive" : ""
                      }
                      aria-invalid={!!errors.specialization}
                      aria-describedby={
                        errors.specialization
                          ? "specialization-error"
                          : undefined
                      }
                    />
                    {errors.specialization && (
                      <p
                        id="specialization-error"
                        className="text-sm text-destructive"
                      >
                        {errors.specialization.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseFile">
                      Medical License Certificate
                    </Label>
                    <div className="relative">
                      <Upload className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="licenseFile"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          setValue("licenseFile", e.target.files?.[0] || null)
                        }
                        className={`pl-10 file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 ${
                          errors.licenseFile ? "border-destructive" : ""
                        }`}
                        aria-invalid={!!errors.licenseFile}
                        aria-describedby={
                          errors.licenseFile ? "licenseFile-error" : undefined
                        }
                      />
                    </div>
                    {errors.licenseFile && (
                      <p
                        id="licenseFile-error"
                        className="text-sm text-destructive"
                      >
                        {errors.licenseFile.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full mt-6 focus-visible-ring"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-pulse w-4 h-4 rounded mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Sign In Link */}
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

            {/* Security Note */}
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

export default SignUpForm;
