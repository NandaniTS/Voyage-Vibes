import { ModelEnums } from "@repo/definitions";
import { model, Schema, Types } from "mongoose";
import MongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";
import "./user-model";
import "./package-model";
import "./booking-model";

export interface IReviewDocument extends SoftDeleteDocument {
  userId: Types.ObjectId;
  packageId: Types.ObjectId;
  bookingId: Types.ObjectId;
  rating: number;
  comment: string;
  response?: {
    text: string;
    respondedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReviewDocument>(
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
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: ModelEnums.BOOKING,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    response: {
      text: String,
      respondedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: "all" });

reviewSchema.virtual("user", {
  ref: ModelEnums.USER,
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

reviewSchema.virtual("package", {
  ref:ModelEnums.PACKAGE,
  localField: "packageId",
  foreignField: "_id",
  justOne: true,
});

export const ReviewModel: SoftDeleteModel<IReviewDocument> = model<
  IReviewDocument,
  SoftDeleteModel<IReviewDocument>
>("Review", reviewSchema);
