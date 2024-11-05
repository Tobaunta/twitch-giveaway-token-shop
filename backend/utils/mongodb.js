import mongoose from "mongoose"; // Import the Mongoose ODM library for interacting with MongoDB

const connectDB = async () => {
  // 1. Connect to MongoDB database
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // 2. Log connection success message
    console.log(`MongoDB Connected: ${conn.connection.host}`); // Log the hostname of the connected MongoDB instance
  } catch (error) {
    // 3. Handle connection errors
    console.error(`Error: ${error.message}`); // Log the error message
    process.exit(1); // Exit the process with an error code (1) indicating failure
  }
};

export default connectDB; // Export the connectDB function for use in your application
