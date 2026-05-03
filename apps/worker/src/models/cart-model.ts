import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  packageId: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  duration: string;
  startDate: string;
  endDate: string;
  seatsAvailable: number;
  category: string;
  startLocation: string;
  endLocation: string;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  packageId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  image: { type: String, required: true },
  duration: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  seatsAvailable: { type: Number, required: true },
  category: { type: String, required: true },
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
});

const CartSchema = new Schema<ICart>({
  userId: { type: String, required: true, ref: 'User' },
  items: [CartItemSchema],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field before saving
CartSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
