import { asyncHandler } from "../utils/asyncHandler.js";

import db from "../db/db.js";
export const markMessageAsRead = asyncHandler(async (req, res) => {
  try {
    const { message_id, user_id } = req.params;

    const [message] = await db.execute(
      "SELECT * FROM message WHERE message_id = ?",
      [message_id]
    );
    if (message.length === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    const [user] = await db.execute("SELECT * FROM users WHERE user_id = ?", [
      user_id,
    ]);
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const [existingReceipt] = await db.execute(
      "SELECT * FROM message_read_receipts WHERE message_id = ? AND user_id = ?",
      [message_id, user_id]
    );

    if (existingReceipt.length > 0) {
      await db.execute(
        "UPDATE message_read_receipts SET is_read = TRUE, read_at = NOW() WHERE message_id = ? AND user_id = ?",
        [message_id, user_id]
      );
    } else {
      await db.execute(
        "INSERT INTO message_read_receipts (message_id, user_id, is_read, read_at) VALUES (?, ?, TRUE, NOW())",
        [message_id, user_id]
      );
    }

    res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});





export const getReadStatus = asyncHandler(async (req, res) => {
  try {
    const { message_id } = req.params;

    const [message] = await db.execute(
      "SELECT * FROM message WHERE message_id = ?",
      [message_id]
    );
    if (message.length === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    const [readReceipts] = await db.execute(
      "SELECT users.user_id, users.name, message_read_receipts.read_at FROM message_read_receipts " +
        "JOIN users ON message_read_receipts.user_id = users.user_id " +
        "WHERE message_read_receipts.message_id = ? AND message_read_receipts.is_read = TRUE",
      [message_id]
    );

    res.status(200).json({
      message: "Read status retrieved",
      read_by:
        readReceipts.length > 0
          ? readReceipts
          : "No users have read this message yet",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
