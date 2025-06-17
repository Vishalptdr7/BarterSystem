import pool from "../db/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createSkill = asyncHandler(async (req, res) => {
  const { skill_name, description } = req.body;

  if (!skill_name) {
    return res.status(400).json({ message: "Skill name is required" });
  }

  const [result] = await pool.query(
    "INSERT INTO skills (skill_name, description) VALUES (?, ?)",
    [skill_name, description]
  );

  res.status(201).json({
    message: "Skill added successfully",
    skill_id: result.insertId,
  });
});

export const getAllSkills = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM skills");
  res.json(rows);
});

export const getSkillById = asyncHandler(async (req, res) => {
  const { skill_id } = req.params;
  const [rows] = await pool.query("SELECT * FROM skills WHERE skill_id = ?", [
    skill_id,
  ]);

  if (rows.length === 0) {
    return res.status(404).json({ message: "Skill not found" });
  }

  res.json(rows[0]);
});

export const updateSkill = asyncHandler(async (req, res) => {
  const { skill_id } = req.params;
  const { skill_name, description } = req.body;

  const [result] = await pool.query(
    "UPDATE skills SET skill_name = ?, description = ? WHERE skill_id = ?",
    [skill_name, description, skill_id]
  );

  if (result.affectedRows === 0) {
    return res
      .status(404)
      .json({ message: "Skill not found or no changes made" });
  }

  res.json({ message: "Skill updated successfully" });
});

export const deleteSkill = asyncHandler(async (req, res) => {
  const { skill_id } = req.params;
  const [result] = await pool.query("DELETE FROM skills WHERE skill_id = ?", [
    skill_id,
  ]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Skill not found" });
  }

  res.json({ message: "Skill deleted successfully" });
});
