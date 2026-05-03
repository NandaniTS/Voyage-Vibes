export interface CartItem {
  id: string;
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

export interface PaymentRequest {
  amount: number;
  currency: string;
  receipt: string;
  notes: {
    userId?: string;
    items: CartItem[];
    totalAmount: number;
  };
}

export interface PaymentResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: string | null;
  status: string;
  attempts: number;
  notes: Record<string, any>;
  created_at: number;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: string | null;
  status: string;
  attempts: number;
  notes: Record<string, any>;
  created_at: number;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  paymentId?: string;
  orderId?: string;
}

export interface PaymentStatus {
  orderId: string;
  paymentId: string;
  status: 'created' | 'paid' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  createdAt: number;
  updatedAt: number;
}

export interface RefundRequest {
  paymentId: string;
  amount?: number;
  reason?: string;
}

export interface RefundResponse {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  payment_id: string;
  notes: Record<string, any>;
  created_at: number;
  status: string;
}
