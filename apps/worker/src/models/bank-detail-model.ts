import { model, Schema, Types } from "mongoose";
import MongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from "mongoose-delete";

export interface IBankDetailDocument extends SoftDeleteDocument {
  agentId: Types.ObjectId;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bankDetailSchema = new Schema<IBankDetailDocument>(
  {
    agentId: { type: Schema.Types.ObjectId, ref: "user", required: true, unique: true },
    accountHolderName: { type: String, required: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    branchName: { type: String },
  },
  { timestamps: true }
);

bankDetailSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: "all" });

export const BankDetailModel: SoftDeleteModel<IBankDetailDocument> = model<
  IBankDetailDocument,
  SoftDeleteModel<IBankDetailDocument>
>("bankdetail", bankDetailSchema);
