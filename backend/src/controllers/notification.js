import { asyncHandler } from "../utils/asyncHandler.js";
import db from "../db/db.js"
import { io } from "../lib/socket.js";
import { getReceiverSocketId } from "../lib/socket.js";
export const sendNotification = asyncHandler(async (req, res) => {
  try {
    const { user_id, sender_id, message } = req.body;

    if (!user_id || !sender_id || !message) {
      return res.status(400).json({
        message: "User ID, sender ID, and message are required",
      });
    }

    // Store notification in the database
    const [result] = await db.execute(
      "INSERT INTO notification (user_id, sender_id, message) VALUES (?, ?, ?)",
      [user_id, sender_id, message]
    );

    const notification_id = result.insertId;

    // Check if the receiver is online
    const receiverSocketId = getReceiverSocketId(user_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveNotification", {
        notification_id,
        user_id,
        sender_id,
        message,
        is_read: false,
        created_at: new Date(),
      });
    }

    res.status(201).json({ message: "Notification sent", notification_id });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



export const getUserNotifications = asyncHandler(async (req, res) => {
  try {
    const { user_id } = req.params;

    const [notifications] = await db.execute(
      "SELECT * FROM notification WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );

    res.status(200).json({ message: "Notifications retrieved", notifications });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


export const markNotificationAsRead = asyncHandler(async (req, res) => {
  try {
    const { notification_id } = req.params;

    const [result] = await db.execute(
      "UPDATE notification SET is_read = TRUE WHERE notification_id = ?",
      [notification_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




export const deleteNotification = asyncHandler(async (req, res) => {
  try {
    const { notification_id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM notification WHERE notification_id = ?",
      [notification_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
