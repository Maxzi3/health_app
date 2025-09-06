// models/User.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "PATIENT" | "DOCTOR";
  specialization?: string;
  licenseNumber?: string;
  experience?: number;
  bio?: string;
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
    },
    role: { type: String, enum: ["PATIENT", "DOCTOR"], required: true },
    specialization: { type: String },
    licenseNumber: { type: String },
    experience: { type: Number },
    bio: { type: String },
    documents: [{ type: String }],
    otp: { type: String },
    otpExpiry: { type: Date },
    emailVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    needsProfileCompletion: { type: Boolean, default: false },
    googleId: { type: String },
    refreshToken: { type: String, default: null },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

// Clear cached model to prevent conflicts
delete mongoose.models.User;
export default mongoose.model<IUser>("User", UserSchema);
