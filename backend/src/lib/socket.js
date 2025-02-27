import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Adjust based on your frontend URL
    methods: ["GET", "POST", "DELETE", "PUT", "POST"],
    credentials: true,
  },
});

const userSocketMap = new Map(); // Stores userId → socketId

export function getReceiverSocketId(userId) {
  return userSocketMap.get(userId) || null;
}

io.on("connection", (socket) => {
  const userId =
    socket.handshake.auth?.userId || socket.handshake.query?.userId;
  if (!userId || userId === "undefined") {
    socket.disconnect(true); // Force disconnect to avoid ghost sockets
    return;
  }

  console.log("✅ User connected:", socket.id, "with userId:", userId);

  userSocketMap.set(userId, socket.id);
  console.log("🔵 Online Users:", [...userSocketMap.keys()]);

  io.emit("getOnlineUsers", [...userSocketMap.keys()]);

  socket.on("createGroup", ({ groupId, members }) => {
    members.forEach((member) => {
      const memberSocketId = getReceiverSocketId(member);
      if (memberSocketId) {
        io.sockets.sockets.get(memberSocketId)?.join(groupId);
      }
    });
    console.log(`🚀 Group ${groupId} created with members:`, members);
    io.to(groupId).emit("groupCreated", { groupId, members });
  });

  socket.on("sendMessage", ({ groupId, message, sender }) => {
    console.log(`📩 Message from ${sender} to Group ${groupId}:`, message);
    io.to(groupId).emit("receiveMessage", { message, sender });
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);

    if (userSocketMap.has(userId)) {
      userSocketMap.delete(userId);
      console.log("🔴 Updated Online Users:", [...userSocketMap.keys()]);
      io.emit("getOnlineUsers", [...userSocketMap.keys()]);
    }
  });
});

export { io, app, server };
