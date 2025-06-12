import db from "../db/db.js"; // MySQL Database Connection
import { asyncHandler } from "../utils/asyncHandler.js";
import cloudinary from "cloudinary";
import { io } from "../lib/socket.js";
import { getReceiverSocketId } from "../lib/socket.js";

// Send a new message
export const sendMessage = asyncHandler(async (req, res) => {
  try {
    let { content } = req.body;
    const { receiver_id } = req.params;
    const sender_id = req.user?.user_id;
    console.log(content);
    if (!sender_id || !receiver_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure text is not undefined, set it to null if empty
    if (content === undefined || content.trim() === "") {
      content = null;
    }

    // Handle multiple image uploads
    let imageUrls = [];
    console.log(req.files?.image);
    if (req.files?.image) {
      try {
        const uploadPromises = req.files.image.map(async (file) => {
          const uploadResponse = await cloudinary.uploader.upload(file.path, {
            folder: "chat_images",
          });
          return uploadResponse.secure_url;
        });

        imageUrls = await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return res.status(500).json({ error: "Failed to upload images" });
      }
    }

    const imageUrl = imageUrls.length > 0 ? imageUrls.join(",") : null; // Convert array to comma-separated string

    const [result] = await db.execute(
      `INSERT INTO message (sender_user_id, receiver_user_id, content, image, sent_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [sender_id, receiver_id, content, imageUrl]
    );

    const newMessage = {
      message_id: result.insertId,
      sender_user_id: sender_id,
      receiver_user_id: receiver_id,
      content: content,
      images: imageUrls,
      sent_at: new Date(),
    };

    // Emit real-time message event with corrected event name and structure
    const receiverSocketId = getReceiverSocketId(receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        message: newMessage,
        sender: sender_id,
      });
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
       WHERE u.user_id != ? AND (m.sender_user_id = ? OR m.receiver_user_id = ?)`,
      [loggedInUserId, loggedInUserId, loggedInUserId]
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

    console.log("Received message_id:", message_id);
    console.log("Received user_id:", user_id);

    if (!message_id || !user_id) {
      return res
        .status(400)
        .json({ error: "message_id and user_id are required" });
    }

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

