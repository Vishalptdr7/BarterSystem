// Create a new review
import { asyncHandler } from "../utils/asyncHandler.js";
import pool from "../db/db.js";
export const createReview = asyncHandler(async (req, res) => {
  const { reviewer_user_id, reviewee_user_id, swap_id, rating, comments } =
    req.body;

    
  if (
    !reviewer_user_id ||
    !reviewee_user_id ||
    !swap_id ||
    !rating ||
    !comments
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  const [swapExists] = await pool.execute(
    "SELECT * FROM swap WHERE swap_id = ?",
    [swap_id]
  );
  if (swapExists.length === 0) {
    return res.status(400).json({ message: "Invalid swap ID." });
  }

  const [result] = await pool.execute(
    "INSERT INTO review (swap_id, reviewer_user_id, reviewee_user_id, rating, comments) VALUES (?, ?, ?, ?, ?)",
    [swap_id, reviewer_user_id, reviewee_user_id, rating, comments]
  );

  await updateAverageRating(reviewee_user_id);

  res.status(201).json({
    message: "Review created successfully",
    review_id: result.insertId,
  });
});



export const updateReview = asyncHandler(async (req, res) => {
  const { review_id } = req.params;
  const { rating, comments } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  const [reviewExists] = await pool.execute(
    "SELECT * FROM review WHERE review_id = ?",
    [review_id]
  );
  if (reviewExists.length === 0) {
    return res.status(404).json({ message: "Review not found." });
  }

  const [oldReview] = await pool.execute(
    "SELECT * FROM review WHERE review_id = ?",
    [review_id]
  );
  const oldRating = oldReview[0].rating;

  await pool.execute(
    "UPDATE review SET rating = ?, comments = ? WHERE review_id = ?",
    [rating, comments, review_id]
  );

  if (oldRating !== rating) {
    const [reviewedUser] = await pool.execute(
      "SELECT reviewee_user_id FROM review WHERE review_id = ?",
      [review_id]
    );
    const reviewedUserId = reviewedUser[0].reviewee_user_id;
    await updateAverageRating(reviewedUserId);
  }

  res.json({ message: "Review updated successfully." });
});



export const getUserReviews = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const [rows] = await pool.execute(
    "SELECT * FROM review WHERE reviewee_user_id = ?",
    [user_id]
  );
  res.json(rows);
});

export const getReview = asyncHandler(async (req, res) => {
  const { review_id } = req.params;
  const [rows] = await pool.execute(
    "SELECT * FROM review WHERE review_id = ?",
    [review_id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Review not found." });
  }

  res.json(rows[0]);
});




export const deleteReview = asyncHandler(async (req, res) => {
  const { review_id } = req.params;

  const [reviewExists] = await pool.execute(
    "SELECT * FROM review WHERE review_id = ?",
    [review_id]
  );
  if (reviewExists.length === 0) {
    return res.status(404).json({ message: "Review not found." });
  }

  const [oldReview] = await pool.execute(
    "SELECT reviewee_user_id FROM review WHERE review_id = ?",
    [review_id]
  );
  const reviewedUserId = oldReview[0].reviewee_user_id;

  await pool.execute("DELETE FROM review WHERE review_id = ?", [review_id]);

  await updateAverageRating(reviewedUserId);

  res.json({ message: "Review deleted successfully." });
});
const updateAverageRating = async (revieweeUserId) => {
  const [ratings] = await pool.execute(
    "SELECT rating FROM review WHERE reviewee_user_id = ?",
    [revieweeUserId]
  );

  if (ratings.length === 0) {
    await pool.execute(
      "UPDATE users SET average_rating = 0 WHERE user_id = ?",
      [revieweeUserId]
    );
    return;
  }

  const totalRatings = ratings.reduce((acc, { rating }) => acc + rating, 0);
  const averageRating = totalRatings / ratings.length;

  await pool.execute("UPDATE users SET average_rating = ? WHERE user_id = ?", [
    averageRating,
    revieweeUserId,
  ]);
};
