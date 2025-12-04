// frontend/src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const createSocket = (userId) =>
  io(SOCKET_URL, {
    withCredentials: true,
    query: { userId }, // backend reads socket.handshake.query.userId
  });
