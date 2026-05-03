import { Types } from "mongoose";
import { BaseService } from "./base-service";
import { IReviewDocument, ReviewModel } from "../models/review-model";

export class ReviewService extends BaseService<IReviewDocument> {
  constructor() {
    super(ReviewModel);
  }

  async createReview(data: {
    userId: string;
    packageId: string;
    bookingId: string;
    rating: number;
    comment: string;
  }) {
    const existingReview = await this.model.findOne({
      userId: new Types.ObjectId(data.userId),
      bookingId: new Types.ObjectId(data.bookingId),
    });

    if (existingReview) {
      throw new Error("Review already exists for this booking");
    }

    const review = await this.model.create({
      ...data,
      userId: new Types.ObjectId(data.userId),
      packageId: new Types.ObjectId(data.packageId),
      bookingId: new Types.ObjectId(data.bookingId),
    });
    return review;
  }

  async getReviewsByUser(userId: string) {
    const reviews = await this.model
      .find({ userId: new Types.ObjectId(userId) })
      .populate("packageId")
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    return reviews;
  }

  async getReviewsByPackage(packageId: string) {
    const reviews = await this.model
      .find({ packageId: new Types.ObjectId(packageId) })
      .populate("userId", "fullName email")
      .populate("packageId")
      .sort({ createdAt: -1 });

    return reviews;
  }

  async getReviewsByAgent(agentId: string) {
    const reviews = await this.model
      .find({})
      .populate({
        path: "packageId",
        match: { agentId },
      })
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    return reviews.filter((review) => review.packageId !== null);
  }

  async updateReview(reviewId: string, userId: string, data: { rating: number; comment: string }) {
    const review = await this.model.findOne({ _id: new Types.ObjectId(reviewId), userId: new Types.ObjectId(userId) });

    if (!review) {
      throw new Error("Review not found or unauthorized");
    }

    review.rating = data.rating;
    review.comment = data.comment;
    await review.save();

    return review;
  }

  async addResponse(reviewId: string, responseText: string) {
    const review = await this.model.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    review.response = {
      text: responseText,
      respondedAt: new Date(),
    };

    await review.save();
    return review;
  }

  async deleteReview(reviewId: string, userId: string) {
    const review = await this.model.findOne({ _id: new Types.ObjectId(reviewId), userId: new Types.ObjectId(userId) });

    if (!review) {
      throw new Error("Review not found or unauthorized");
    }

    await review.delete();
    return { message: "Review deleted successfully" };
  }
}
