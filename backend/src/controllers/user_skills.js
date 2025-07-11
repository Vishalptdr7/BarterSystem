import pool from "../db/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const validProficiencyLevels = ["Beginner", "Intermediate", "Advanced"];

export const getAllUserSkills = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute("SELECT * FROM user_skills");
  res.json(rows);
});

export const getUserSkillsByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  const [rows] = await pool.execute(
    `
    SELECT us.user_skill_id, s.skill_name, us.proficiency_level
    FROM user_skills us
    JOIN skills s ON us.skill_id = s.skill_id
    WHERE us.user_id = ?`,
    [user_id]
  );

  res.json(rows);
});


export const addSkillToUser = asyncHandler(async (req, res) => {
  const { user_id, skill_id, proficiency_level } = req.body;

  if (!user_id || !skill_id || !proficiency_level) {
    return res
      .status(400)
      .json({
        message: "User ID, Skill ID, and Proficiency level are required",
      });
  }

  if (!validProficiencyLevels.includes(proficiency_level)) {
    return res
      .status(400)
      .json({
        message:
          "Invalid proficiency level. It must be one of 'Beginner', 'Intermediate', or 'Advanced'.",
      });
  }

  const [result] = await pool.execute(
    "INSERT INTO user_skills (user_id, skill_id, proficiency_level) VALUES (?, ?, ?)",
    [user_id, skill_id, proficiency_level]
  );
  res
    .status(201)
    .json({
      message: "Skill added to user successfully",
      user_skill_id: result.insertId,
    });
});

export const updateUserSkill = asyncHandler(async (req, res) => {
  const { user_skill_id } = req.params;
  const { proficiency_level } = req.body;

  if (!proficiency_level) {
    return res.status(400).json({ message: "Missing proficiency level" });
  }

  if (!validProficiencyLevels.includes(proficiency_level)) {
    return res
      .status(400)
      .json({
        message:
          "Invalid proficiency level. It must be one of 'Beginner', 'Intermediate', or 'Advanced'.",
      });
  }

  await pool.execute(
    "UPDATE user_skills SET proficiency_level = ? WHERE user_skill_id = ?",
    [proficiency_level, user_skill_id]
  );
  res.json({ message: "User skill updated successfully" });
});

export const deleteUserSkill = asyncHandler(async (req, res) => {
  const { user_skill_id } = req.params;
  await pool.execute("DELETE FROM user_skills WHERE user_skill_id = ?", [
    user_skill_id,
  ]);
  res.json({ message: "User skill deleted successfully" });
});
