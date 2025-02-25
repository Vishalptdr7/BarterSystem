import db from "../db/db.js"; // MySQL Database Connection
import { asyncHandler } from "../utils/asyncHandler.js";
import cloudinary from "cloudinary";
import { io } from "../lib/socket.js";
import { getReceiverSocketId } from "../lib/socket.js";

// Send a new message
export const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { text, image } = req.body;
    const { receiver_id } = req.params;
    const sender_id = req.user.user_id; // Assuming req.user contains user_id

    let imageUrl = null;
    if (image) {
      // Upload image to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Insert message into database
    const [result] = await db.execute(
      "INSERT INTO message (sender_user_id, receiver_user_id, content, image) VALUES (?, ?, ?, ?)",
      [sender_id, receiver_id, text, imageUrl]
    );

    const newMessage = {
      message_id: result.insertId,
      sender_user_id: sender_id,
      receiver_user_id: receiver_id,
      content: text,
      image: imageUrl,
      sent_at: new Date(),
    };

    // Emit real-time message event
    const receiverSocketId = getReceiverSocketId(receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get users for the sidebar (Users that the current user has chatted with)
export const getUsersForSidebar = asyncHandler(async (req, res) => {
  try {
    const loggedInUserId = req.user.user_id; // Assuming req.user contains user_id

    const [users] = await db.execute(
      `SELECT DISTINCT u.user_id, u.name, u.email 
       FROM users u
       JOIN message m ON u.user_id = m.sender_user_id OR u.user_id = m.receiver_user_id
       WHERE u.user_id != ?`,
      [loggedInUserId]
    );

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersForSidebar controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all messages between two users
export const getMessages = asyncHandler(async (req, res) => {
  try {
    const { receiver_id } = req.params;
    const sender_id = req.user.user_id; // Assuming req.user contains user_id

    const [messages] = await db.execute(
      `SELECT * FROM message 
       WHERE (sender_user_id = ? AND receiver_user_id = ?) 
          OR (sender_user_id = ? AND receiver_user_id = ?) 
       ORDER BY sent_at ASC`,
      [sender_id, receiver_id, receiver_id, sender_id]
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Mark a message as read
export const markMessageAsRead = asyncHandler(async (req, res) => {
  try {
    const { message_id, user_id } = req.body;

    await db.execute(
      `INSERT INTO message_read_receipts (message_id, user_id, is_read, read_at)
       VALUES (?, ?, TRUE, NOW())
       ON DUPLICATE KEY UPDATE is_read = TRUE, read_at = NOW()`,
      [message_id, user_id]
    );

    res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    console.error("Error in markMessageAsRead controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
