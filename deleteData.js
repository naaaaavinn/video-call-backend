import mongoose from "mongoose";
import User from "./models/UsersModel.js";
import dotenv from "dotenv";

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Mongo DB Connected Successfully"))
  .catch((err) => console.log(err));

async function deletData() {
  try {
    await User.deleteMany();
    console.log("Data Deleted Successfully");
  } catch (error) {
    console.log(error);
  }
  process.exit();
}

deletData();
