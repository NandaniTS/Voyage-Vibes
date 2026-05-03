import { TUser, ModelEnums } from "@repo/definitions";
import { model, Schema } from "mongoose";
import MongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";

export type IUserDocument = SoftDeleteDocument & TUser;

const userSchema = new Schema<IUserDocument>(
  {
    fullName: {
      type: String,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
    },

    userType: {
      type: String,
    },

    phoneNumber: {
      type: String,
      trim: true,
    },

    bankDetails: {
      accountHolderName: { type: String },
      accountNumber: { type: String },
      bankName: { type: String },
      ifscCode: { type: String },
    },

    isSuspended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: "all" });

export const UserModel: SoftDeleteModel<IUserDocument> = model<
  IUserDocument,
  SoftDeleteModel<IUserDocument>
>(ModelEnums.USER, userSchema);