"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Heart, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ThemeToggle from "../ThemeToggle";
import Logo from "../Logo";
// import { useToast } from "@/hooks/use-toast";

interface OTPVerificationProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerified,
  onBack,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  //   const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (error) setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.replace(/\D/g, "").split("").slice(0, 6);

    const newOtp = [...otp];
    pasteArray.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setOtp(newOtp);

    // Focus the next empty input or last input
    const nextIndex = Math.min(pasteArray.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      console.log("POST /api/verify-otp", { email, otp: otpString });

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      //   toast({
      //     title: "Email Verified Successfully!",
      //     description: "Your account has been verified.",
      //   });

      onVerified();
    } catch (error) {
      setError("Invalid verification code. Please try again.");
      //   toast({
      //     title: "Verification Failed",
      //     description: "Invalid code. Please check and try again.",
      //     variant: "destructive",
      //   });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);

    try {
      // Simulate API call
      console.log("POST /api/resend-otp", { email });

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      //   toast({
      //     title: "New Code Sent",
      //     description: "A new verification code has been sent to your email.",
      //   });

      setTimeLeft(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      //   toast({
      //     title: "Error",
      //     description: "Failed to resend code. Please try again.",
      //     variant: "destructive",
      //   });
    } finally {
      setIsResending(false);
    }
  };

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
      <div className="min-h-screen  flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="card-medical p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Logo/>
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
            <div className="space-y-4">
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-12 h-12 text-center text-lg font-semibold input-medical ${
                      error ? "border-destructive" : ""
                    }`}
                  />
                ))}
              </div>
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              disabled={isLoading || otp.join("").length !== 6}
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
                  {isResending ? "Sending..." : "Resend Code"}
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
