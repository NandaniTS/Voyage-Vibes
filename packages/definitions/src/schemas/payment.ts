import { z } from "zod";

export const cartItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  originalPrice: z.number(),
  image: z.string().url(),
  duration: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  seatsAvailable: z.number(),
  category: z.string(),
  startLocation: z.string(),
  endLocation: z.string(),
});

export const paymentRequestSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  receipt: z.string(),
  notes: z.object({
    userId: z.string().optional(),
    items: z.array(cartItemSchema),
    totalAmount: z.number(),
  }),
});

export const paymentResponseSchema = z.object({
  id: z.string(),
  entity: z.string(),
  amount: z.number(),
  amount_paid: z.number(),
  amount_due: z.number(),
  currency: z.string(),
  receipt: z.string(),
  offer_id: z.string().nullable(),
  status: z.string(),
  attempts: z.number(),
  notes: z.record(z.any()),
  created_at: z.number(),
});

export const razorpayOrderSchema = z.object({
  id: z.string(),
  entity: z.string(),
  amount: z.number(),
  amount_paid: z.number(),
  amount_due: z.number(),
  currency: z.string(),
  receipt: z.string(),
  offer_id: z.string().nullable(),
  status: z.string(),
  attempts: z.number(),
  notes: z.record(z.any()),
  created_at: z.number(),
});

export const razorpayOptionsSchema = z.object({
  key: z.string(),
  amount: z.number(),
  currency: z.string(),
  name: z.string(),
  description: z.string(),
  order_id: z.string(),
  handler: z.function(),
  prefill: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    contact: z.string().optional(),
  }),
  theme: z.object({
    color: z.string(),
  }),
});

export const razorpayResponseSchema = z.object({
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_signature: z.string(),
});

export const paymentVerificationRequestSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export const paymentVerificationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  paymentId: z.string().optional(),
  orderId: z.string().optional(),
});

export const paymentStatusSchema = z.object({
  orderId: z.string(),
  paymentId: z.string(),
  status: z.enum(["created", "paid", "failed", "refunded"]),
  amount: z.number(),
  currency: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const refundRequestSchema = z.object({
  paymentId: z.string(),
  amount: z.number().positive().optional(),
  reason: z.string().optional(),
});

export const refundResponseSchema = z.object({
  id: z.string(),
  entity: z.string(),
  amount: z.number(),
  currency: z.string(),
  payment_id: z.string(),
  notes: z.record(z.any()),
  created_at: z.number(),
  status: z.string(),
});

export const createOrderRequestSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  receipt: z.string(),
  notes: z.record(z.string()).optional(),
});

export const createOrderResponseSchema = z.object({
  success: z.boolean(),
  order: z.object({
    id: z.string(),
    entity: z.string(),
    amount: z.number(),
    amount_paid: z.number(),
    amount_due: z.number(),
    currency: z.string(),
    receipt: z.string(),
    offer_id: z.string().nullable(),
    status: z.string(),
    attempts: z.number(),
    notes: z.record(z.any()),
    created_at: z.number(),
  }),
  key: z.string(),
});

