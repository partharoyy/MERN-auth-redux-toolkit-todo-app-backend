import mongoose from 'mongoose';

export async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log('Connected to DB');
  } catch (error) {
    console.log('Error connecting to DB', error);
  }
}
