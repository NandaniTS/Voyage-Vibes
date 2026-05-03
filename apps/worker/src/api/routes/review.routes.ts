import { Router, Request, Response } from "express";
import { ReviewService } from "../../services/review-service";

const router = Router();
const reviewService = new ReviewService();

// Create review
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, packageId, bookingId, rating, comment } = req.body;

    if (!userId || !packageId || !bookingId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const review = await reviewService.createReview({
      userId,
      packageId,
      bookingId,
      rating,
      comment,
    });

    return res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create review",
    });
  }
});

// Get reviews by user
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const reviews = await reviewService.getReviewsByUser(userId as string);

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch reviews",
    });
  }
});

// Get reviews by package
router.get("/package/:packageId", async (req: Request, res: Response) => {
  try {
    const { packageId } = req.params;
    const reviews = await reviewService.getReviewsByPackage(packageId as string);

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch reviews",
    });
  }
});

// Get reviews by agent
router.get("/agent/:agentId", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const reviews = await reviewService.getReviewsByAgent(agentId as string);

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch reviews",
    });
  }
});

// Update review
router.put("/:reviewId", async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { userId, rating, comment } = req.body;

    if (!userId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const review = await reviewService.updateReview(reviewId as string, userId, { rating, comment });

    return res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update review",
    });
  }
});

// Add response to review (agent only)
router.post("/:reviewId/response", async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { responseText } = req.body;

    if (!responseText) {
      return res.status(400).json({
        success: false,
        message: "Response text is required",
      });
    }

    const review = await reviewService.addResponse(reviewId as string, responseText);

    return res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to add response",
    });
  }
});

// Delete review
router.delete("/:reviewId", async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await reviewService.deleteReview(reviewId as string, userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete review",
    });
  }
});

export default router;
