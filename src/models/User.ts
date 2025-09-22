import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "PATIENT" | "DOCTOR";

  // Doctor-specific fields
  specialization?: string;
  licenseNumber?: string;
  experience?: number;
  bio?: string;

  // Patient-specific fields
  dateOfBirth?: Date;
  gender?: "Male" | "Female" | "Other";
  address?: string;
  bloodGroup?: string;
  genotype?: string;

  documents?: string[];
  otp?: string | null;
  otpExpiry?: Date | null;
  emailVerified: boolean;
  isApproved: boolean;
  googleId?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  refreshToken?: string | null;
  needsProfileCompletion: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  phone?: string;
  isDeleted?: boolean;
  deletedAt?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      select: false,
    },
    role: { type: String, enum: ["PATIENT", "DOCTOR"], required: true },
    phone: { type: String },

    // Doctor fields
    specialization: { type: String },
    licenseNumber: { type: String },
    experience: { type: Number },
    bio: { type: String },

    // Patient fields
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    address: { type: String },
    bloodGroup: { type: String },
    genotype: { type: String },

    documents: [{ type: String }],
    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },
    emailVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    needsProfileCompletion: { type: Boolean, default: false },
    googleId: { type: String, select: false },
    refreshToken: { type: String, default: null, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    resetToken: { type: String, select: false },
    resetTokenExpiry: { type: Date, select: false },
    isDeleted: { type: Boolean, default: false, select: false },
    deletedAt: { type: Date, default: null, select: false },
  },
  { timestamps: true }
);

// Clear cached model to prevent conflicts in dev
delete mongoose.models.User;
export default mongoose.model<IUser>("User", UserSchema);
