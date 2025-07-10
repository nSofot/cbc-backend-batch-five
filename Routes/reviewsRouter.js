import express from "express";
import {
  getAllReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", getAllReviews);                  // GET all reviews
router.post("/", createReview);                  // POST a new review
router.patch("/:id", updateReviewStatus);        // PATCH status update
router.delete("/:id", deleteReview);             // DELETE a review

export default router;
