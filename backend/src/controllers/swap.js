import pool from "../db/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Initiate Swap Request
export const initiateSwap = asyncHandler(async (req, res) => {
  const { sender_id, receiver_id, sender_skill_id, receiver_skill_id, status } = req.body;

  if (!sender_id || !receiver_id || !sender_skill_id || !receiver_skill_id || !status) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const [result] = await pool.execute(
    "INSERT INTO swap (sender_user_id, receiver_user_id, sender_skill_id, receiver_skill_id, status) VALUES (?, ?, ?, ?, ?)",
    [sender_id, receiver_id, sender_skill_id, receiver_skill_id, status]
  );

  res.status(201).json({
    message: "Swap request initiated successfully",
    swap_id: result.insertId,
  });
});

// Get All Swaps of a User
export const getUserSwaps = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const [rows] = await pool.execute(
    "SELECT * FROM swap WHERE sender_user_id = ? OR receiver_user_id = ?",
    [user_id, user_id]
  );
  res.json(rows);
});

// Get Swap Details
export const getSwapDetails = asyncHandler(async (req, res) => {
  const { swap_id } = req.params;
  console.log(swap_id)
  const [rows] = await pool.execute("SELECT * FROM swap WHERE swap_id = ?", [swap_id]);
  if (rows.length === 0) {
    return res.status(404).json({ message: "Swap not found." });
  }
  res.json(rows[0]);
});

// Update Swap Status
export const updateSwapStatus = asyncHandler(async (req, res) => {
  const { swap_id } = req.params;
  const { status } = req.body;
  const validStatuses = ["Pending", "Accepted", "Rejected", "Completed"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status update." });
  }

  const [swapExists] = await pool.execute("SELECT * FROM swap WHERE swap_id = ?", [swap_id]);
  if (swapExists.length === 0) {
    return res.status(404).json({ message: "Swap not found." });
  }

  await pool.execute("UPDATE swap SET status = ? WHERE swap_id = ?", [status, swap_id]);
  res.json({ message: "Swap status updated successfully." });
});

// Delete Swap Request
export const deleteSwap = asyncHandler(async (req, res) => {
  const { swap_id } = req.params;
  const [swapExists] = await pool.execute("SELECT * FROM swap WHERE swap_id = ?", [swap_id]);
  if (swapExists.length === 0) {
    return res.status(404).json({ message: "Swap not found." });
  }

  await pool.execute("DELETE FROM swap WHERE swap_id = ?", [swap_id]);
  res.json({ message: "Swap request deleted successfully." });
});
