// connectDB.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Could not connect to MongoDB...', error);
    process.exit(1);
  }
};

export default connectDB;
