"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ThemeToggle from "../ThemeToggle";
import Logo from "../Logo";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface OTPVerificationProps {
  email: string | null;
  onVerified: () => void;
  onBack: () => void;
}

// ✅ Zod schema
const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Please enter a 6-digit code"),
});

type OTPFormValues = z.infer<typeof otpSchema>;

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerified,
  onBack,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  // ⏳ Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // ✅ Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const otpValue = watch("otp");

  // ✅ Handle typing digit by digit
  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const currentOtp = otpValue.split("");
    currentOtp[index] = value.replace(/\D/g, ""); // only digits
    const newOtp = currentOtp.join("");
    setValue("otp", newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpValue[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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

  // ✅ Verify handler
  const onSubmit = async (values: OTPFormValues) => {
    if (!email) {
      setError("otp", { message: "No email provided for verification" });
      return;
    }
    setIsLoading(true);
    setIsSuccess(false);
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: values.otp }),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid response from server");
      }

      if (res.ok && data.message) {
        setIsSuccess(true);
        setSuccessMessage(data.message);
        setTimeout(() => {
          onVerified();
        }, 3000); // Increased timeout for UX
      } else {
        // Preserve input by not resetting
        setError("otp", {
          message:
            data.error ||
            data.message ||
            "Invalid verification code. Please try again.",
        });
        inputRefs.current[5]?.focus(); // Focus last input for correction
      }
    } catch (err: any) {
      setError("otp", { message: err.message || "Something went wrong." });
      inputRefs.current[5]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Resend handler
  const handleResendOTP = async () => {
    if (isResending || !email) return;

    setIsResending(true);
    setIsSuccess(false);
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid response from server");
      }

      if (res.ok && data.success) {
        setIsSuccess(true);
        setSuccessMessage("New code sent! Check your inbox.");
        setTimeLeft(60);
        reset({ otp: "" });
        inputRefs.current[0]?.focus();
      } else {
        throw new Error(data.message || "Failed to resend code");
      }
    } catch (err: any) {
      setError("otp", { message: err.message || "Something went wrong" });
    } finally {
      setIsResending(false);
    }
  };

  // ✅ Helper styling
  const getInputClassName = (hasError: boolean, hasSuccess: boolean) => {
    let baseClass = "w-12 h-12 text-center text-lg font-semibold input-medical";

    if (hasError) {
      baseClass += " border-red-500 focus:border-red-500";
    } else if (hasSuccess) {
      baseClass += " border-green-500 focus:border-green-500";
    }

    return baseClass;
  };

  // ✅ Validate email prop
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="card-medical p-8">
          <p className="text-center text-red-500 font-medium">
            Error: No email provided for verification.
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
      {/* Back Button */}
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

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="card-medical p-8">
            {/* Header */}
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
              <p className="text-muted-foreground leading-relaxed">
                We&apos;ve sent a 6-digit verification code to <br />
                <strong>{email}</strong>
              </p>
            </div>

            {/* OTP Input */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex justify-center space-x-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpValue[index] || ""}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={getInputClassName(!!errors.otp, isSuccess)}
                    aria-label={`OTP digit ${index + 1}`}
                    aria-invalid={!!errors.otp}
                    aria-describedby={errors.otp ? "otp-error" : undefined}
                  />
                ))}
              </div>

              {/* Error Message */}
              {errors.otp && (
                <div className="text-center">
                  <p
                    id="otp-error"
                    className="text-sm text-red-500 font-medium"
                  >
                    {errors.otp.message}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {isSuccess && successMessage && (
                <div className="text-center">
                  <p className="text-sm text-green-500 font-medium flex items-center justify-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {successMessage}
                  </p>
                </div>
              )}

              {/* Verify Button */}
              <Button
                type="submit"
                disabled={isLoading || otpValue.length !== 6}
                className="btn-primary w-full mt-6 focus-visible-ring"
              >
                {isLoading ? (
                  <>
                    <div className="loading-pulse w-4 h-4 rounded mr-2"></div>
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

            {/* Resend Code */}
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
                  className="text-primary hover:text-primary/80 font-semibold focus-visible-ring"
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

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Check your spam folder if you don&apos;t see the email in your
                inbox
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OTPVerification;
