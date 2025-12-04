import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./utils/db.js";

import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import notificationRoute from "./routes/notification.route.js";

import { createSocketServer } from "./socket/socket.js";

const __dirname = path.resolve();

dotenv.config({
  path: path.join(__dirname, "backend", ".env"),
});

const app = express();

const allowedOrigins = ["http://localhost:5173", process.env.URL].filter(
  Boolean
);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/notification", notificationRoute);

app.use(express.static(path.join(__dirname, "frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

// Create a SINGLE socket IO server
const server = createSocketServer(app);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});
