import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      // Give Atlas SRV DNS resolution + server selection more breathing room
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      family: 4, // prefer IPv4 — avoids slow/failing IPv6 DNS on some networks
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    // A transient failure (e.g. DNS ETIMEOUT) must NOT poison the cache —
    // clear the rejected promise so the next request retries cleanly.
    cached.promise = null;
    throw err;
  }
}
