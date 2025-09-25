/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const profileSchema = z.object({
  specialization: z.string().min(1, "Please select a specialization"),
  licenseNumber: z.string().min(1, "Medical license number is required"),
  experience: z
    .string()
    .regex(/^\d+$/, "Please enter a valid number of years")
    .optional(),
  bio: z.string().optional(),
  cv: z
    .instanceof(File, { message: "Please upload a CV (PDF or DOC)" })
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function CompleteProfileForm() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      specialization: "",
      licenseNumber: "",
      experience: "",
      bio: "",
      cv: undefined,
    },
  });

  const cvFile = watch("cv");

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const form = new FormData();
      form.append("specialization", data.specialization);
      form.append("licenseNumber", data.licenseNumber);
      if (data.experience) form.append("experience", data.experience);
      if (data.bio) form.append("bio", data.bio);
      if (data.cv) form.append("cv", data.cv);

      const response = await fetch("/api/auth/complete-profile", {
        method: "POST",
        body: form,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      await update({
        ...session,
        user: { ...session?.user, needsProfileCompletion: false },
      });

      toast.success("Profile completed successfully!");
      router.push("/pending");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const onBack = () => router.push("/");

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
              Complete Your Profile
            </h2>
            <p className="text-muted-foreground">
              Provide details to finalize your doctor profile
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialization">Medical Specialization *</Label>
              <select
                id="specialization"
                {...register("specialization")}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-secondary ${
                  errors.specialization ? "border-destructive" : "border-border"
                }`}
              >
                <option value="">Select your specialization</option>
                <option value="General Practitioner">
                  General Practitioner
                </option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Endocrinologist">Endocrinologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Oncologist">Oncologist</option>
                <option value="Orthopedist">Orthopedist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Psychiatrist">Psychiatrist</option>
                <option value="Psychologist">Psychologist</option>
                <option value="Pulmonologist">Pulmonologist</option>
                <option value="Radiologist">Radiologist</option>
                <option value="Surgeon">Surgeon</option>
                <option value="Urologist">Urologist</option>
                <option value="Allergist">Allergist</option>
                <option value="Infectious Disease Specialist">
                  Infectious Disease Specialist
                </option>
                <option value="Internal Medicine">Internal Medicine</option>
                <option value="Emergency Medicine">Emergency Medicine</option>
                <option value="Other">Other</option>
              </select>

              {errors.specialization && (
                <p className="text-sm text-destructive">
                  {errors.specialization.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cv">Upload CV (PDF or DOC)</Label>

              <div className="flex items-center gap-3">
                {/* Hidden real input */}
                <Input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || undefined;
                    setValue("cv", file);
                    e.target.value = "";
                  }}
                />

                {/* Styled button as file picker */}
                <label
                  htmlFor="cv"
                  className="cursor-pointer px-4 py-2 rounded-md bg-primary text-primary-foreground 
                 hover:bg-primary/90 transition font-medium shadow-sm"
                >
                  Choose File
                </label>

                {/* Show selected file name */}
                {cvFile && (
                  <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {cvFile.name}
                  </span>
                )}
              </div>

              {/* Error message */}
              {errors.cv && (
                <p className="text-sm text-destructive">{errors.cv.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">Medical License Number *</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="licenseNumber"
                  placeholder="Enter your medical license number"
                  {...register("licenseNumber")}
                  className={`pl-10 ${
                    errors.licenseNumber ? "border-destructive" : ""
                  }`}
                />
              </div>
              {errors.licenseNumber && (
                <p className="text-sm text-destructive">
                  {errors.licenseNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Years of medical practice"
                {...register("experience")}
                className={errors.experience ? "border-destructive" : ""}
              />
              {errors.experience && (
                <p className="text-sm text-destructive">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <textarea
                id="bio"
                rows={4}
                placeholder="Brief description of your background, expertise, and approach to patient care..."
                {...register("bio")}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.bio ? "border-destructive" : "border-border"
                }`}
              />
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-6 focus-visible-ring"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Your profile will be reviewed by our admin team before dashboard
              access.
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
