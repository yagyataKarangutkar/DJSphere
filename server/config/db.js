import mongoose from 'mongoose';
import { seedDatabase } from './seed.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);
    console.log(`MongoDB readyState: ${mongoose.connection.readyState}`);

    // Seed database with mock events and clubs
    await seedDatabase();
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;