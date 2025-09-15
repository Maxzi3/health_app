"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const schema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const id = params.get("id");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange", // ensures validation happens while typing
  });

  useEffect(() => {
    if (!token || !id) {
      // No token/id → redirect to forgot-password
      router.replace("/auth/forgot-password");
    }
  }, [token, id, router]);

  const onSubmit = async (data: FormData) => {
    if (!token || !id) return; 

    setLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          id,
          newPassword: data.newPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Something went wrong");
        return;
      }

      // ✅ Success toast
      toast.success("Password reset successful! Please log in.");
      router.push("/auth/login?reset=success");
    } catch (err) {
      console.error("Reset password request failed:", err);
      setServerError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Watch field values
  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const isButtonDisabled =
    loading ||
    isSubmitting ||
    !isValid ||
    !newPassword ||
    !confirmPassword ||
    !token ||
    !id;

  return (
    <>
      <div className="flex items-center justify-between p-2">
        <Logo />
        <ThemeToggle />
      </div>
      <div className="flex items-center justify-center mt-20 px-4">
        <Card className="w-full max-w-md p-6 shadow-md rounded-2xl animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Reset Password
          </h2>
          {!token || !id ? (
            <p className="text-center text-destructive">
              Invalid or expired reset link.
            </p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    {...register("newPassword")}
                    className={`pl-10 pr-10 ${
                      errors.newPassword ? "border-destructive" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus-visible-ring"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {errors.newPassword.message}
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
                    placeholder="Confirm new password"
                    {...register("confirmPassword")}
                    className={`pl-10 pr-10 ${
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
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Server error */}
              {serverError && (
                <p className="text-red-500 text-sm text-center">
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isButtonDisabled}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </>
  );
}
