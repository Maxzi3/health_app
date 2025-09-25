import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.DATABASE_LOCAL as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the DATABASE_LOCAL environment variable inside .env.local"
  );
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// 👇 Extend the global object with our cache type
declare global {
  var mongoose: MongooseCache | undefined;
}

// Use cached connection across hot reloads in dev
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", false); // ensures dev logs are off
  }
  return cached.conn;
}
