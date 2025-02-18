import db from "../db/db.js"; // Ensure database connection
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadfileOnCloudinary } from "../utils/cloudinary.js";
import cloudinary from "cloudinary";
// Send a message
export const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { chat_id, sender_user_id, content } = req.body;
    const image = req.files?.image?.[0]?.path || null; // Ensure it's null if not provided
    let image_url = null;

    if (!chat_id || !sender_user_id) {
      return res
        .status(400)
        .json({ message: "Chat ID and Sender ID are required" });
    }


    if (image) {
      try {
        const uploadOnCloud = await uploadfileOnCloudinary(image);
        image_url = uploadOnCloud.secure_url;
      } catch (uploadError) {
        return res
          .status(500)
          .json({ message: "Image upload failed", error: uploadError.message });
      }
    }


    // Ensure at least one of `content` or `image_url` is present
    const messageContent = content && content.trim() !== "" ? content : null;
    if (!messageContent && !image_url) {
      return res
        .status(400)
        .json({ message: "Message must contain text or an image" });
    }

    // Insert into database
    const [result] = await db.execute(
      "INSERT INTO message (chat_id, sender_user_id, content, image) VALUES (?, ?, ?, ?)",
      [chat_id, sender_user_id, messageContent, image_url]
    );

    res.status(201).json({
      message: "Message sent successfully",
      message_id: result.insertId,
      content: messageContent,
      image_url: image_url,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// Get all messages in a chat
export const getMessagesInChat =asyncHandler( async (req, res) => {
  try {
    const { chat_id } = req.params;

    const [messages] = await db.execute(
      "SELECT * FROM message WHERE chat_id = ? ORDER BY sent_at ASC",
      [chat_id]
    );

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a message by message ID
export const deleteMessage =asyncHandler( async (req, res) => {
  try {
    const { message_id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM message WHERE message_id = ?",
      [message_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


