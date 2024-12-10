import express from "express";
import cors from "cors";
import { RtcTokenBuilder } from "agora-access-token";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/UsersModel.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Mongo DB Connected Successfully"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello from node");
});

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

app.post("/generate-token", (req, res) => {
  const { channelName } = req.body;

  const uid = Math.trunc(Math.random() * 230);
  console.log();

  const expirationTimeInSeconds = 3600 * 24; // Token valid for 1 day
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTime + expirationTimeInSeconds;

  // Generate the token
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    1,
    privilegeExpiredTs
  );

  res.status(200).json({ token, uid });
});

app.post("/add-user", async (req, res) => {
  try {
    const { name, roomName, uid } = req.body;
    const user = await User.create({ name, roomName, uid });
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/delete-user/:id", async (req, res) => {
  try {
    const { id } = req.query;
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/get-user", async (req, res) => {
  try {
    const { uid, roomName } = req.body;
    const user = await User.findOne({ uid, roomName });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
