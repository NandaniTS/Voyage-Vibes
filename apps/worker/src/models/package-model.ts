import mongoose, { model, Schema, Types } from "mongoose";
import {
  TPackage,
  ModelEnums,
} from "@repo/definitions";
import { SoftDeleteDocument, SoftDeleteModel } from "mongoose-delete";

export type IPackageDocument =  TPackage & SoftDeleteDocument ;

const PackageSchema = new mongoose.Schema<IPackageDocument>(
  {
    title: {
      type: String,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
    },

    itinerary: [
      {
        day: { type: Number },
        title: { type: String },
        description: { type: String },
        activities: [{ type: String }],
      },
    ],

    price: { type: Number },
    disountPrice: { type: Number },
    currency: { type: String },

    startLocation: { type: String },
    endLocation: { type: String },

    destinations: [{ type: String }],
    category: [{ type: String }],

    images: [{ type: String }],

    noOfDays: { type: Number },
    noOfNights: { type: Number },

    duration: [
      {
        from: { type: String },
        to: { type: String },
      },
    ],

    minAge: { type: Number },

    agentId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    totalSeats: { type: Number, default: 0 },
    availableSeats: { type: Number, default: 0 },

    availableDates: [
      {
        startDate: { type: Date },
        endDate: { type: Date },
        seatsAvailable: { type: Number },
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const PackageModel: SoftDeleteModel<IPackageDocument> = model<
  IPackageDocument,
  SoftDeleteModel<IPackageDocument>
>(ModelEnums.PACKAGE, PackageSchema);
