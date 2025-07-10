import express from "express";
import {
  getAllReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.get("/", getAllReviews);           // GET all reviews
reviewRouter.post("/", createReview);           // POST a new review
reviewRouter.patch("/:id", updateReviewStatus); // PATCH status update
reviewRouter.delete("/:id", deleteReview);      // DELETE a review

export default reviewRouter;
