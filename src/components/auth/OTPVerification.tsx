/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Mail, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import ThemeToggle from "../ThemeToggle";
import Logo from "../Logo";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface OTPVerificationProps {
  email: string | null;
  onVerified: () => void;
  onBack: () => void;
}

const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Please enter a 6-digit code"),
});

type OTPFormValues = z.infer<typeof otpSchema>;

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerified,
  onBack,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    reset,
    formState: { errors },
  } = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const otpValue = watch("otp");

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (paste.length === 6) {
      setValue("otp", paste);
      inputRefs.current[5]?.focus();
    } else {
      setError("otp", { message: "Pasted code must be 6 digits" });
    }
  };

 const onSubmit = async (data: OTPFormValues) => {
   setIsLoading(true);
   try {
     const response = await fetch("/api/auth/verify-otp", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ ...data, email }),
     });

     const result = await response.json();

     if (!response.ok) {
       toast.error(result.error || "OTP verification failed");
       return;
     }
     reset();
     onVerified();
   } catch (error) {
     console.error(error);
     toast.error("An error occurred while verifying OTP");
   } finally {
     setIsLoading(false);
   }
 };

  const handleResendOTP = async () => {
    if (isResending || !email) return;
    setIsResending(true);

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend OTP");

      toast.success(data.message || "New code sent!");
      setTimeLeft(60);
      setValue("otp", "");
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="card-medical p-8">
          <p className="text-center text-destructive font-medium">
            Error: No email provided.
          </p>
          <Button
            onClick={onBack}
            variant="ghost"
            className="mt-4 w-full text-muted-foreground hover:text-foreground focus-visible-ring"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Card>
      </div>
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

      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="card-medical p-8 w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Logo />
            </div>
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl w-fit mx-auto mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Verify Your Email
            </h2>
            <p className="text-muted-foreground">
              We&apos;ve sent a 6-digit code to <br />
              <strong>{email}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-center space-x-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otpValue[index] || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    const newOtp = (otpValue || "").split("");
                    newOtp[index] = value;
                    setValue("otp", newOtp.join(""));
                    if (value && index < 5)
                      inputRefs.current[index + 1]?.focus();
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      !otpValue[index] &&
                      index > 0
                    ) {
                      inputRefs.current[index - 1]?.focus();
                    }
                  }}
                  onPaste={handlePaste}
                  className={`w-12 h-12 text-center text-lg font-semibold ${
                    errors.otp
                      ? "border-destructive focus:border-destructive"
                      : ""
                  }`}
                  aria-label={`OTP digit ${index + 1}`}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                />
              ))}
            </div>

            {errors.otp && (
              <p className="text-center text-sm text-destructive">
                {errors.otp.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading || otpValue.length !== 6}
              className="btn-primary w-full mt-6 focus-visible-ring"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Email
                </>
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground mb-2">
              Didn&apos;t receive the code?
            </p>
            {timeLeft > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend in {timeLeft} seconds
              </p>
            ) : (
              <Button
                onClick={handleResendOTP}
                variant="ghost"
                disabled={isResending}
                className="text-primary hover:text-primary/80 focus-visible-ring"
              >
                {isResending ? (
                  <>
                    <div className="loading-pulse w-4 h-4 rounded mr-2"></div>
                    Sending...
                  </>
                ) : (
                  "Resend Code"
                )}
              </Button>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Check your spam folder if the email is not in your inbox
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default OTPVerification;
