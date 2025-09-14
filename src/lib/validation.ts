import { z } from "zod";

export const doctorProfileSchema = z.object({
  name: z.string(),
  email: z.email(),
  role: z.literal("DOCTOR"),
  specialization: z.string().min(2),
  experience: z.number().min(0),
  licenseNumber: z.string().min(5),
  bio: z.string().optional(),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
});

export const patientProfileSchema = z.object({
  name: z.string(),
  email: z.email(),
  role: z.literal("PATIENT"),
  dateOfBirth: z.string().optional(), 
  verified:z.boolean().optional(),
  gender: z.enum(["Male", "Female", "Other"]),
  address: z.string().optional(),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  genotype: z.enum(["AA", "AS", "SS", "AC"]).optional(),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
});

export const passwordUpdateSchema = z
  .object({
    email: z.email(),
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type DoctorProfile = z.infer<typeof doctorProfileSchema>;
export type PatientProfile = z.infer<typeof patientProfileSchema>;
