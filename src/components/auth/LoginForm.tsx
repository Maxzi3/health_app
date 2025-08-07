"use client";
import { useState } from "react";
import { ArrowLeft, Heart, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
import GoogleOAuthButton from "./GoogleOAuthButton";
import ThemeToggle from "../ThemeToggle";
import Logo from "../Logo";

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
  onBack: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onBack,
  onSwitchToSignup,
  onForgotPassword,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  //   const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      console.log("POST /api/login", formData);

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      //   toast({
      //     title: "Welcome Back!",
      //     description: "Successfully signed in to your account.",
      //   });

      // Redirect to dashboard
      console.log("Redirecting to dashboard...");
    } catch (error) {
      //   toast({
      //     title: "Sign In Failed",
      //     description: "Invalid email or password. Please try again.",
      //     variant: "destructive",
      //   });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    console.log("Initiating Google OAuth login");
    // toast({
    //   title: "Google Sign In",
    //   description: "Redirecting to Google authentication...",
    // });
  };

  return (
    <>
      <div className="flex items-center justify-between p-2">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-0 text-muted-foreground hover:text-foreground focus-visible-ring"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
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

              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome Back
              </h2>
              <p className="text-muted-foreground">
                Sign in to your HealthConnect account
              </p>
            </div>

            {/* Google OAuth */}
            <GoogleOAuthButton
              onClick={handleGoogleAuth}
              text="Sign in with Google"
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
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`input-medical pl-10 ${
                      errors.email ? "border-destructive" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`input-medical pl-10 pr-10 ${
                      errors.password ? "border-destructive" : ""
                    }`}
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
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  onClick={onForgotPassword}
                  className="text-sm text-primary hover:text-primary/80 font-medium focus-visible-ring"
                >
                  Forgot password?
                </button>
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
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button
                  onClick={onSwitchToSignup}
                  className="text-primary hover:text-primary/80 font-semibold focus-visible-ring"
                >
                  Sign Up
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

export default LoginForm;
