import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "PATIENT" | "DOCTOR";
  specialization?: string;
  licenseNumber?: string;
  documents?: string[];
  otp: string;
  otpExpiry: Date;
  emailVerified: boolean;
  isApproved: boolean;
  googleId?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["PATIENT", "DOCTOR"], required: true },
    specialization: { type: String },
    licenseNumber: { type: String },
    documents: [{ type: String }],
    otp: { type: String, required: true },
    otpExpiry: { type: Date, required: true },
    emailVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    googleId: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }, 
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
