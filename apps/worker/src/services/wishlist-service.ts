import { Types } from "mongoose";
import { BaseService } from "./base-service";
import { IWishlistDocument, WishlistModel } from "../models/wishlist-model";

export class WishlistService extends BaseService<IWishlistDocument> {
  constructor() {
    super(WishlistModel);
  }

  async addToWishlist(userId: string, packageId: string) {
    const existing = await this.model.findOne({
      userId: new Types.ObjectId(userId),
      packageId: new Types.ObjectId(packageId),
    });

    if (existing) {
      throw new Error("Package already in wishlist");
    }

    const wishlistItem = await this.model.create({
      userId: new Types.ObjectId(userId),
      packageId: new Types.ObjectId(packageId),
      savedDate: new Date(),
    });

    return wishlistItem;
  }

  async removeFromWishlist(packageId: string, userId: string) {
    const wishlistItem = await this.model.findOne({
      userId: new Types.ObjectId(userId),
      packageId: new Types.ObjectId(packageId),
    });

    if (!wishlistItem) {
      throw new Error("Package not found in wishlist");
    }

    await wishlistItem.delete();
    return { message: "Removed from wishlist" };
  }

  async removeWishlistById(wishlistId: string, userId: string) {
    const wishlistItem = await this.model.findOne({
      _id: new Types.ObjectId(wishlistId),
      userId: new Types.ObjectId(userId),
    });

    if (!wishlistItem) {
      throw new Error("Wishlist item not found");
    }

    await wishlistItem.delete();
    return { message: "Removed from wishlist" };
  }

  async getUserWishlist(userId: string, populate = false) {
    const query = this.model
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ savedDate: -1 });

    if (populate) {
      query.populate("packageId").populate("userId", "fullName email");
    }

    const wishlist = await query;

    if (!populate) return wishlist;

    return wishlist.map((item) => {
      const obj = item.toObject() as unknown as Record<string, unknown>;
      const { packageId, userId: uid, ...rest } = obj;
      return { ...rest, package: packageId, user: uid };
    });
  }

  async checkInWishlist(userId: string, packageId: string) {
    const exists = await this.model.findOne({
      userId: new Types.ObjectId(userId),
      packageId: new Types.ObjectId(packageId),
    });
    return { inWishlist: !!exists };
  }
}
