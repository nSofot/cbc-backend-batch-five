import Review from "../models/review.js";

/**
 * @desc Get all reviews
 * @route GET /api/reviews
 */
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
};

/**
 * @desc Create a new review
 * @route POST /api/reviews
 */
export const createReview = async (req, res) => {
  try {
    const {
      productId,
      productName,
      productImage,
      userId,
      userName,
      userEmail,
      rating,
      comment,
    } = req.body;

    const newReview = new Review({
      productId,
      productName,
      productImage,
      userId,
      userName,
      userEmail,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json({ message: "Review submitted", review: newReview });
  } catch (err) {
    res.status(400).json({ message: "Failed to submit review", error: err.message });
  }
};

/**
 * @desc Update review status (approve/reject)
 * @route PATCH /api/reviews/:id
 */
export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Status updated", review: updatedReview });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
};

/**
 * @desc Delete a review
 * @route DELETE /api/reviews/:id
 */
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Review.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review", error: err.message });
  }
};
