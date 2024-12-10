import mongoose, { Schema } from "mongoose";

const usersSchema = new Schema({
  uid: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", usersSchema);

export default User;
