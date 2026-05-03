import z from "zod";
import { ReviewSchema, CreateReviewResponseSchema, CreateReviewSchema, GetAllReviewsResponseSchema, GetAllReviewSchema, GetByIdReviewResponseSchema, GetByIdReviewSchema, UpdateReviewResponseSchema, UpdateReviewSchema } from "../schemas";

export type TReview = z.infer<typeof ReviewSchema>;

//REQUEST

export type TCreateReviewRequest = z.infer<typeof CreateReviewSchema>;

export type TUpdateReviewRequest = z.infer<typeof UpdateReviewSchema>;

export type TGetByIdReviewRequest = z.infer<typeof GetByIdReviewSchema>;

export type TGetAllReviewRequest = z.infer<typeof GetAllReviewSchema>;

//RESPONSE

export type TCreateReviewResponse = z.infer<typeof CreateReviewResponseSchema>;

export type TUpdateReviewResponse = z.infer<typeof UpdateReviewResponseSchema>;

export type TGetByIdReviewResponse = z.infer<typeof GetByIdReviewResponseSchema>;

export type TGetAllReviewResponse = z.infer<typeof GetAllReviewsResponseSchema>;