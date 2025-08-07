"use client";
import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  FileText,
  Eye,
  EyeOff,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
import GoogleOAuthButton from "./GoogleOAuthButton";
import OTPVerification from "./OTPVerification";
import Logo from "../Logo";
import ThemeToggle from "../ThemeToggle";

interface SignUpFormProps {
  role: "patient" | "doctor";
  onSwitchToLogin: () => void;
  onBack: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  role,
  onSwitchToLogin,
  onBack,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    medicalLicense: "",
    licenseFile: null as File | null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"form" | "otp" | "pending">("pending");
  // const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (role === "doctor" && !formData.medicalLicense.trim()) {
      newErrors.medicalLicense = "Medical license number is required";
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, licenseFile: file }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      console.log("POST /api/signup", {
        ...formData,
        role,
        licenseFile: formData.licenseFile?.name,
      });

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // toast({
      //   title: "Account Created Successfully!",
      //   description: "Please check your email for verification.",
      // });

      setStep("otp");
    } catch (error) {
      // toast({
      //   title: "Sign Up Failed",
      //   description: "Please try again later.",
      //   variant: "destructive",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerified = () => {
    if (role === "doctor") {
      setStep("pending");
    } else {
      // toast({
      //   title: "Welcome to HealthConnect!",
      //   description: "Your account has been verified successfully.",
      // });
      // Redirect to patient dashboard
      console.log("Redirecting to patient dashboard...");
    }
  };

  const handleGoogleAuth = () => {
    console.log("Initiating Google OAuth for", role);
    // toast({
    //   title: "Google Sign In",
    //   description: "Redirecting to Google authentication...",
    // });
  };

  if (step === "otp") {
    return (
      <OTPVerification
        email={formData.email}
        onVerified={handleOTPVerified}
        onBack={() => setStep("form")}
      />
    );
  }

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
              account is currently under review. You will be notified via email
              once your credentials are verified and approved.
            </p>

            <div className="bg-accent p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground">
                ✅ Email verified
                <br />
                🔍 Medical credentials under review
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
      <div className="min-h-screen  flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Back Button */}

          <Card className="card-medical p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Logo />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                {role === "patient"
                  ? "Join Your Health Journey"
                  : "Join Our Medical Network"}
              </h2>
              <p className="text-muted-foreground">
                Create your {role} account to get started
              </p>
            </div>

            {/* Google OAuth */}
            <GoogleOAuthButton
              onClick={handleGoogleAuth}
              text={`Sign up with Google as ${role}`}
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
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`input-medical pl-10 ${
                      errors.fullName ? "border-destructive" : ""
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

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
                    placeholder="Create a strong password"
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`input-medical pl-10 pr-10 ${
                      errors.confirmPassword ? "border-destructive" : ""
                    }`}
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
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Doctor-specific fields */}
              {role === "doctor" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="medicalLicense">
                      Medical License Number
                    </Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="medicalLicense"
                        name="medicalLicense"
                        type="text"
                        placeholder="Enter your license number"
                        value={formData.medicalLicense}
                        onChange={handleInputChange}
                        className={`input-medical pl-10 ${
                          errors.medicalLicense ? "border-destructive" : ""
                        }`}
                      />
                    </div>
                    {errors.medicalLicense && (
                      <p className="text-sm text-destructive">
                        {errors.medicalLicense}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseFile">
                      Medical License Certificate (Optional)
                    </Label>
                    <div className="relative">
                      <Upload className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="licenseFile"
                        name="licenseFile"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="input-medical pl-10 file:mr-4 file:py- file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </div>
                    {formData.licenseFile && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {formData.licenseFile.name}
                      </p>
                    )}
                  </div>
                </>
              )}
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
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

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
