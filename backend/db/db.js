import mongoose from "mongoose";

const connectDB = async () => {
  const URL = process.env.MONGO_URL;
  try {
    mongoose.connect(URL);
    console.log("connected to database successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
