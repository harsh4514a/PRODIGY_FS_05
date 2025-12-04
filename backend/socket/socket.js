import { Server } from "socket.io";
import http from "http";

let io;
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

export const createSocketServer = (app) => {
  const server = http.createServer(app);

  const allowedOrigins = [
    "http://localhost:5173",
    process.env.URL
  ].filter(Boolean);

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      if (userId) delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return server; // <-- RETURN SOCKET SERVER HERE
};

export { io };
