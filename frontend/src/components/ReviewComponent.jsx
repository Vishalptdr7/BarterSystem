import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "../lib/axios";

const ReviewComponent = ({ reviewerId, revieweeId, swapId }) => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const { data } = await axiosInstance.get(`/review/user/${revieweeId}`);
      setReviews(data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [revieweeId]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        reviewer_user_id: reviewerId,
        reviewee_user_id: revieweeId,
        swap_id: swapId,
        rating,
        comments,
      };
      await axiosInstance
      .post("/review", payload);
      fetchReviews();
      setRating(0);
      setComments("");
    } catch (error) {
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await axiosInstance.delete(`/review/${reviewId}`);
      fetchReviews();
    } catch (error) {
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>
      <form onSubmit={submitReview} className="mb-6">
        <div className="mb-4">
          <label className="block mb-2">Rating:</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Comments:</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="border p-2 rounded w-full"
            required
          ></textarea>
        </div>
        <Button type="submit">Submit Review</Button>
      </form>

      {reviews.map((review) => (
        <Card key={review.review_id} className="mb-4">
          <CardContent>
            <p className="font-bold">Rating: {review.rating}</p>
            <p>{review.comments}</p>
            {review.reviewer_user_id === reviewerId && (
              <Button
                onClick={() => deleteReview(review.review_id)}
                variant="destructive"
                className="mt-2"
              >
                Delete Review
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewComponent;
