import mongoose, { ConnectOptions } from "mongoose";

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/avisa-next";

if (!MONGO_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Utilizamos "type assertion" para indicarle a TypeScript que global tiene la propiedad `mongoose`
const globalWithMongoose = global as typeof global & {
  mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
};

// Usa `const` ya que no se reasigna
const cached = globalWithMongoose.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options: ConnectOptions = {}; // No necesitamos opciones específicas en versiones recientes
    cached.promise = mongoose
      .connect(MONGO_URI, options)
      .then((mongoose) => mongoose.connection);
  }

  cached.conn = await cached.promise;
  globalWithMongoose.mongoose = cached; // Almacena el caché en `global`
  return cached.conn;
}

export default dbConnect;
