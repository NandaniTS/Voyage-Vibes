import { ModelEnums } from "@repo/definitions";
import { model, Schema, Types } from "mongoose";
import "./package-model"; // ensure Package schema is registered
import "./user-model"; // ensure User schema is registered
import MongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";

export interface IWishlistDocument extends SoftDeleteDocument {
  userId: Types.ObjectId;
  packageId: Types.ObjectId;
  savedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlistDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: ModelEnums.USER,
      required: true,
    },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: ModelEnums.PACKAGE,
      required: true,
    },
    savedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


wishlistSchema.virtual("package", {
  ref:ModelEnums.PACKAGE,
  localField: "packageId",
  foreignField: "_id",
  justOne: true,
});

wishlistSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: "all" });


export const WishlistModel: SoftDeleteModel<IWishlistDocument> = model<
  IWishlistDocument,
  SoftDeleteModel<IWishlistDocument>
>("Wishlist", wishlistSchema);
