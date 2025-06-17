import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  },
});

const userSocketMap = new Map();

export function getReceiverSocketId(userId) {
  const socketSet = userSocketMap.get(userId);
  return socketSet ? [...socketSet][0] : null;
}

io.on("connection", (socket) => {
  const userId =
    socket.handshake.auth?.userId || socket.handshake.query?.userId;

  if (!userId || userId === "undefined") {
    socket.disconnect(true);
    return;
  }

  if (userSocketMap.has(userId)) {
    userSocketMap.get(userId).add(socket.id);
  } else {
    userSocketMap.set(userId, new Set([socket.id]));
  }


  io.emit("getOnlineUsers", [...userSocketMap.keys()]);

  socket.on("createGroup", ({ groupId, members }) => {
    members.forEach((member) => {
      const memberSockets = userSocketMap.get(member);
      if (memberSockets) {
        memberSockets.forEach((sockId) => {
          io.sockets.sockets.get(sockId)?.join(groupId);
        });
      }
    });

    io.to(groupId).emit("groupCreated", { groupId, members });
  });

  // 🔵 SEND MESSAGE
  socket.on("sendMessage", ({ groupId, message, sender, receiver }) => {
    if (groupId) {
      
      io.to(groupId).emit("receiveMessage", { message, sender });
    } else {
      const receiverSockets = userSocketMap.get(receiver);
      const senderSockets = userSocketMap.get(sender);

      receiverSockets?.forEach((sockId) => {
        io.to(sockId).emit("receiveMessage", { message, sender });
      });

      senderSockets?.forEach((sockId) => {
        io.to(sockId).emit("receiveMessage", { message, sender });
      });

    }
  });

  // 🔵 NOTIFICATION
  socket.on("sendNotification", (data) => {
    io.emit("receiveNotification", data);
  });

  // 🔴 DISCONNECT
  socket.on("disconnect", () => {
    const socketSet = userSocketMap.get(userId);
    if (socketSet) {
      socketSet.delete(socket.id);

      if (socketSet.size === 0) {
        userSocketMap.delete(userId);
      }

      io.emit("getOnlineUsers", [...userSocketMap.keys()]);
    }
  });
});

export { io, app, server };
