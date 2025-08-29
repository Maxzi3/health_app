import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "PATIENT" | "DOCTOR";
  specialization?: string;
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
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["PATIENT", "DOCTOR"], required: true },

    specialization: { type: String },
    documents: [{ type: String }],

    otp: {
      type: String,
      required: false,
      default: null, 
    },
    otpExpiry: {
      type: Date,
      required: false,
      default: null, 
    },

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

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
