import z from "zod";
import { WishlistSchema, CreateWishlistResponseSchema, CreateWishlistSchema, GetAllWishlistResponseSchema, GetAllWishlistSchema, GetByIdWishlistResponseSchema, GetByIdWishlistSchema, UpdateWishlistResponseSchema, UpdateWishlistSchema } from "../schemas";

export type TWishlist = z.infer<typeof WishlistSchema>;

//REQUEST

export type TCreateWishlistRequest = z.infer<typeof CreateWishlistSchema>;

export type TUpdateWishlistRequest = z.infer<typeof UpdateWishlistSchema>;

export type TGetByIdWishlistRequest = z.infer<typeof GetByIdWishlistSchema>;

export type TGetAllWishlistRequest = z.infer<typeof GetAllWishlistSchema>;

//RESPONSE

export type TCreateWishlistResponse = z.infer<typeof CreateWishlistResponseSchema>;

export type TUpdateWishlistResponse = z.infer<typeof UpdateWishlistResponseSchema>;

export type TGetByIdWishlistResponse = z.infer<typeof GetByIdWishlistResponseSchema>;

export type TGetAllWishlistResponse = z.infer<typeof GetAllWishlistResponseSchema>;