import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {
  try {
    // Set fallback public DNS servers to resolve MongoDB Atlas SRV records on Windows networks
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (dnsErr) {
      // Ignore if setServers is restricted
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;