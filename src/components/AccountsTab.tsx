/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";

import {
  doctorProfileSchema,
  patientProfileSchema,
  passwordUpdateSchema,
  PatientProfile,
  DoctorProfile,
} from "@/lib/validation";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import { useAuthUser } from "@/store/auth";
import { Skeleton } from "@/components/ui/skeleton";
import z from "zod";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

type PasswordUpdate = z.infer<typeof passwordUpdateSchema>;

interface AccountTabProps {
  patient?: PatientProfile;
  setPatient?: React.Dispatch<React.SetStateAction<PatientProfile | undefined>>;
  doctor?: DoctorProfile;
  setDoctor?: React.Dispatch<React.SetStateAction<DoctorProfile | undefined>>;
}

export default function AccountTab({
  patient,
  setPatient,
  doctor,
  setDoctor,
}: AccountTabProps) {
  const { user } = useAuthUser();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
   const router = useRouter();

  const doctorForm = useForm<DoctorProfile>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: doctor || {
      email: "",
      role: "DOCTOR",
      specialization: "",
      experience: 0,
      licenseNumber: "",
      phone: "",
      bio: "",
    },
    mode: "onChange",
  });

  const patientForm = useForm<PatientProfile>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: patient || {
      email: "",
      role: "PATIENT",
      dateOfBirth: "",
      gender: "Other",
      address: "",
      bloodGroup: "O+",
      genotype: "AA",
      phone: "",
    },
    mode: "onChange",
  });

  const passwordForm = useForm<PasswordUpdate>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      email: user?.email || "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!user?.role || !user?.email) return;

    const fetchProfile = async () => {
      setFetchLoading(true);
      try {
        const endpoint =
          user.role === "DOCTOR" ? "/api/user/doctor" : "/api/user/patient";
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        const profile = data.profile || data;

        if (user.role === "DOCTOR") {
          doctorForm.reset(profile as DoctorProfile);
          setDoctor?.(profile as DoctorProfile);
        } else {
          patientForm.reset(profile as PatientProfile);
          setPatient?.(profile as PatientProfile);
        }
      } catch (err: any) {
        toast.error(err.message || "Could not load profile");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProfile();
  }, [user?.role, user?.email]);

  const onSubmitProfile = async (data: DoctorProfile | PatientProfile) => {
    setProfileLoading(true);
    try {
      const { email, ...rest } = data;
      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Update failed");

      toast.success("Profile updated");

      if (user?.role === "DOCTOR") {
        doctorForm.reset(result.user as DoctorProfile);
        setDoctor?.(result.user as DoctorProfile);
      } else {
        patientForm.reset(result.user as PatientProfile);
        setPatient?.(result.user as PatientProfile);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setProfileLoading(false);
    }
  };


  const onSubmitPassword = async (data: PasswordUpdate) => {
    setPasswordLoading(true);
    try {
      const { email, confirmPassword, ...rest } = data;
      const res = await fetch("/api/user/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Password update failed");

      toast.success("Password updated. Please log in again.");

      // Log user out
      await signOut({ redirect: false }); // we can redirect manually

      // Reset the form
      passwordForm.reset({
        email: user?.email || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Redirect to login page
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };


  if (fetchLoading) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-10 w-40 rounded-lg" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Please log in to manage your account.
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="flex w-full max-w-md mx-auto gap-2 p-1">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        {user.role === "DOCTOR" && (
          <Card className="max-w-2xl mx-auto border">
            <CardHeader>
              <CardTitle>Doctor Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={doctorForm.handleSubmit(onSubmitProfile)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label>Email</Label>
                    <Input {...doctorForm.register("email")} disabled />
                  </div>
                  <div>
                    <Label>Specialization</Label>
                    <Input {...doctorForm.register("specialization")} />
                  </div>
                  <div>
                    <Label>Experience</Label>
                    <Input
                      type="number"
                      {...doctorForm.register("experience", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div>
                    <Label>License Number</Label>
                    <Input {...doctorForm.register("licenseNumber")} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input {...doctorForm.register("phone")} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Bio</Label>
                    <Textarea {...doctorForm.register("bio")} />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={
                      profileLoading ||
                      !doctorForm.formState.isDirty ||
                      !doctorForm.formState.isValid
                    }
                    className="flex-1"
                  >
                    {profileLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => doctorForm.reset(doctorForm.getValues())}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {user.role === "PATIENT" && (
          <Card className="max-w-2xl mx-auto border">
            <CardHeader>
              <CardTitle>Patient Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={patientForm.handleSubmit(onSubmitProfile)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label>Email</Label>
                    <Input
                      {...patientForm.register("email")}
                      disabled
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      {...patientForm.register("dateOfBirth")}
                      value={patientForm.watch("dateOfBirth") ?? ""}
                      onChange={(e) =>
                        patientForm.setValue(
                          "dateOfBirth",
                          e.target.value || undefined
                        )
                      }
                    />
                    {/* Display nicely formatted preview below */}
                    {patientForm.watch("dateOfBirth") ? (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(patientForm.watch("dateOfBirth")!)}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <Label>Gender</Label>
                    <select
                      {...patientForm.register("gender")}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Address</Label>
                    <Input {...patientForm.register("address")} />
                  </div>
                  <div>
                    <Label>Blood Group</Label>
                    <select
                      {...patientForm.register("bloodGroup")}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <Label>Genotype</Label>
                    <select
                      {...patientForm.register("genotype")}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="AA">AA</option>
                      <option value="AS">AS</option>
                      <option value="SS">SS</option>
                      <option value="AC">AC</option>
                    </select>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input {...patientForm.register("phone")} />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={
                      profileLoading ||
                      !patientForm.formState.isDirty ||
                      !patientForm.formState.isValid
                    }
                    className="flex-1"
                  >
                    {profileLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => patientForm.reset(patientForm.getValues())}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="password">
        <Card className="max-w-2xl mx-auto border">
          <CardHeader>
            <CardTitle>Password Management</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label>Old Password</Label>
                  <Input
                    type="password"
                    {...passwordForm.register("oldPassword")}
                  />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    {...passwordForm.register("newPassword")}
                  />
                </div>
                <div>
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    {...passwordForm.register("confirmPassword")}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={
                    passwordLoading ||
                    !passwordForm.formState.isDirty ||
                    !passwordForm.formState.isValid
                  }
                  className="flex-1"
                >
                  {passwordLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Update"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    passwordForm.reset({
                      email: user?.email || "",
                      oldPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    })
                  }
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
