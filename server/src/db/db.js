import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected at ${process.env.MONGO_URI}`);
  } catch (error) {
    console.error("Database connection failed:", error);
    setTimeout(async () => {
      await mongoose.connect(process.env.MONGO_URI);
    }, 1000);
  }
};
