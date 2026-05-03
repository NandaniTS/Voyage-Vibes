import { ModelEnums } from "@repo/definitions";
import { model, Schema, Types } from "mongoose";
import MongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";
import "./user-model";
import "./package-model";

export interface IBookingDocument extends SoftDeleteDocument {
  userId: Types.ObjectId;
  packageId: Types.ObjectId;
  agentId: Types.ObjectId;
  numberOfTravellers: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  bookingDate: Date;
  startDate: Date;
  endDate: Date;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBookingDocument>(
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
    agentId: {
      type: Schema.Types.ObjectId,
      ref: ModelEnums.USER,
      required: true,
    },
    numberOfTravellers: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    specialRequests: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: "all" });

bookingSchema.virtual("package", {
  ref:ModelEnums.PACKAGE,
  localField: "packageId",
  foreignField: "_id",
  justOne: true,
});

bookingSchema.virtual("user", {
  ref:ModelEnums.USER,
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

bookingSchema.virtual("agent", {
  ref:ModelEnums.USER,
  localField: "agentId",
  foreignField: "_id",
  justOne: true,
});

export const BookingModel: SoftDeleteModel<IBookingDocument> = model<
  IBookingDocument,
  SoftDeleteModel<IBookingDocument>
>(ModelEnums.BOOKING, bookingSchema);
