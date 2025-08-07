"use client";
import { useState } from "react";
import { ArrowLeft, Heart, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
import { useAuthUI } from "@/contexts/AuthUIContext";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = () => {
  const { handleBackToLogin: onBackToLogin } = useAuthUI();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  //   const { toast } = useToast();

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      console.log("POST /api/forgot-password", { email });

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSuccess(true);
      //   toast({
      //     title: "Reset Link Sent!",
      //     description: "Check your email for password reset instructions.",
      //   });
    } catch (error) {
      //   toast({
      //     title: "Error",
      //     description: "Failed to send reset link. Please try again.",
      //     variant: "destructive",
      //   });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="card-medical p-8 text-center">
            <div className="p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-2xl w-fit mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">
              Check Your Email
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We&apos;ve sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the instructions to reset your
              password.
            </p>

            <div className="bg-accent p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground">
                📧 Didn&apos;t receive the email? Check your spam folder or try
                again in a few minutes.
              </p>
            </div>

            <Button
              onClick={onBackToLogin}
              className="btn-primary w-full focus-visible-ring"
            >
              Back to Sign In
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Back Button */}
        <Button
          onClick={onBackToLogin}
          variant="ghost"
          className="mb-6 text-muted-foreground hover:text-foreground focus-visible-ring"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Button>

        <Card className="card-medical p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-medical">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient-primary">
                HealthConnect
              </h1>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              Reset Your Password
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Enter your email address and we&apos;ll send you a link to reset
              your password
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleInputChange}
                  className={`input-medical pl-10 ${
                    error ? "border-destructive" : ""
                  }`}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn-primary w-full mt-6 focus-visible-ring"
          >
            {isLoading ? (
              <div className="loading-pulse w-4 h-4 rounded mr-2"></div>
            ) : null}
            {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
          </Button>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <button
                onClick={onBackToLogin}
                className="text-primary hover:text-primary/80 font-semibold focus-visible-ring"
              >
                Sign In
              </button>
            </p>
          </div>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              🔒 Reset links are valid for 1 hour and can only be used once
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
