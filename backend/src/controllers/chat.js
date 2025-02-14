import db from "../db/db.js"; // Ensure database connection

// Start a chat between two users
export const startChat = async (req, res) => {
  try {
    const { user1_id, user2_id } = req.body;

    if (!user1_id || !user2_id) {
      return res
        .status(400)
        .json({ message: "Both user1_id and user2_id are required" });
    }

    const [result] = await db.execute(
      "INSERT INTO chat (user1_id, user2_id) VALUES (?, ?)",
      [user1_id, user2_id]
    );

    res.status(201).json({ message: "Chat started", chat_id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all chats for a specific user
export const getUserChats = async (req, res) => {
  try {
    const { user_id } = req.params;

    const [chats] = await db.execute(
      "SELECT * FROM chat WHERE user1_id = ? OR user2_id = ?",
      [user_id, user_id]
    );

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get chat details by chat ID
export const getChatDetails = async (req, res) => {
  try {
    const { chat_id } = req.params;

    const [chat] = await db.execute("SELECT * FROM chat WHERE chat_id = ?", [
      chat_id,
    ]);

    if (chat.length === 0) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a chat by chat ID
export const deleteChat = async (req, res) => {
  try {
    const { chat_id } = req.params;

    const [result] = await db.execute("DELETE FROM chat WHERE chat_id = ?", [
      chat_id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
