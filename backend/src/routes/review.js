import { Router } from "express";

import {
    createReview,
    getUserReviews,
    getReview,
    updateReview,
    deleteReview
} from "../controllers/reviews.js";


import { verifyJWT } from "../middlewares/auth.js";

const reviewRouter=Router();

reviewRouter.route("/").post(verifyJWT,createReview);

reviewRouter.route("/:user_id").get(verifyJWT,getUserReviews);

reviewRouter.route("/reviewe/:review_id").get(verifyJWT,getReview);

reviewRouter.route("/:review_id").put(verifyJWT,updateReview);

reviewRouter.route("/:review_id").delete(verifyJWT,deleteReview);

export {reviewRouter};