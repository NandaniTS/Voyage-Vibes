"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@heroui/react";
import { FaArrowLeft, FaCreditCard, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";
import toast from "react-hot-toast";
import { loadScript } from "../../../../utils/loadScript";
import { paymentApiWithSession } from "../../../../services/payment";
import { cartApiWithSession } from "../../../../services/cart";
import { useAuth } from "../../../lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { createOrderResponseSchema } from "@repo/definitions";

interface CartItem {
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

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [processingPayment, setProcessingPayment] = useState(false);

  // Get user ID from auth context
  const userId = user?._id;

  const { data: cartData, isLoading } = useQuery({
    queryKey: ["user-cart", userId],
    queryFn: async () => {
      if (!userId) return { items: [] as CartItem[] };
      const response = await cartApiWithSession.getUserCart(userId);
      return response.data;
    },
    enabled: !!userId,
  });

  const cartItems = (cartData as any)?.items || [];

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const calculateTotal = () => {
    return cartItems.reduce((total: number, item: CartItem) => total + item.price, 0);
  };

  const calculateOriginalTotal = () => {
    return cartItems.reduce((total: number, item: CartItem) => total + item.originalPrice, 0);
  };

  const calculateTotalSavings = () => {
    return calculateOriginalTotal() - calculateTotal();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    if (!formData.address.trim()) {
      toast.error('Please enter your address');
      return false;
    }
    return true;
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    // console.log("Payment clicked", validateForm);
    if (!validateForm()) return;
    

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setProcessingPayment(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        setProcessingPayment(false);
        return;
      }

      // Calculate total amount
      const totalAmount = calculateTotal();
      

      // Create order
      const orderData = {
        amount: totalAmount, // Send in rupees, backend will convert to paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          items: cartItems,
          totalAmount: totalAmount,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
        },
      };

      // console.log("Order data being sent to backend:", orderData);

      const orderResponse = await paymentApiWithSession.createOrder(orderData);
      // console.log("Full order response:", orderResponse);
      
      if (!orderResponse || !orderResponse.success) {
        // console.error("Invalid order response:", orderResponse);
        toast.error('Failed to create payment order');
        setProcessingPayment(false);
        return;
      }
      
      const order = orderResponse.order;
      const key = orderResponse.key;
      
      // console.log("Order:", order);
      // console.log("Key:", key);

      // Check if order and key are available
      if (!order) {
        console.error("Order is undefined");
        toast.error('Invalid order response');
        setProcessingPayment(false);
        return;
      }

      if (!key) {
        console.error("Key is undefined");
        toast.error('Invalid payment key');
        setProcessingPayment(false);
        return;
      }

      // Check if Razorpay is available
      if (!window.Razorpay) {
        console.error("Razorpay not loaded");
        toast.error('Payment gateway not loaded');
        setProcessingPayment(false);
        return;
      }

      // Initialize Razorpay with proper options
      const options = {
        key: key, // Use the actual key from response
        amount: order.amount,
        currency: order.currency,
        name: "Voyage Vibes",
        description: `Payment for ${cartItems.length} package(s)`,
        order_id: order.id,
        notes: {
          merchant_order_id: order.id
        },
        handler: async (response: any) => {
          try {
            // Verify payment
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user?._id, // Add user ID to verification request
            };

            const verificationResponse = await paymentApiWithSession.verifyPayment(verificationData);
            // console.log("Verification response:", verificationResponse)
            
            // Check success at root level since response structure is {success: true, ...}
            if (verificationResponse.success) {
              // Clear cart from database
              try {
                const userId = user?._id;
                if (userId) {
                  await cartApiWithSession.clearCart(userId);
                  // console.log("Cart cleared from database for user:", userId);
                } else {
                  console.error("User ID not found, cannot clear cart");
                }
              } catch (cartError) {
                console.error("Failed to clear cart from database:", cartError);
                // Continue with payment success even if cart clear fails
              }
              
              toast.success('Payment successful! Your booking is confirmed.');
              // Redirect to bookings page
              router.push('/traveller/payment-success');
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
          },
        },
      };

      // console.log("Creating Razorpay instance with options:", options);
      
      // Validate options before creating instance
      if (!options.key || !options.amount || !options.order_id) {
        console.error("Invalid Razorpay options:", { key: !!options.key, amount: !!options.amount, order_id: !!options.order_id });
        toast.error('Invalid payment options');
        setProcessingPayment(false);
        return;
      }
      
      const razorpay = new window.Razorpay(options);
      // console.log("Razorpay instance created:", razorpay);
      
      // Open the Razorpay modal
      try {
        razorpay.open();
        // console.log("Razorpay modal opened");
      } catch (error) {
        console.error("Error opening Razorpay modal:", error);
        toast.error('Failed to open payment modal');
        setProcessingPayment(false);
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-(--background) p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FaCreditCard className="mx-auto text-4xl text-(--muted-foreground) mb-4" />
              <p className="text-(--muted-foreground)">Loading checkout...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-(--background) p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FaShoppingCart className="mx-auto text-6xl text-(--muted-foreground) mb-4" />
              <h2 className="text-2xl font-semibold text-(--foreground) mb-2">Your cart is empty</h2>
              <p className="text-(--muted-foreground) mb-6">Add packages to your cart to proceed with checkout</p>
              <Button
                onPress={() => router.push('/traveller/browse')}
                className="bg-(--primary) text-(--primary-foreground)"
              >
                Browse Packages
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-(--background) p-4">
      <div className="">
        {/* <div className="flex items-center justify-between mb-8">
          <Button
            variant="light"
            onPress={() => router.back()}
            className="flex items-center gap-2"
          >
            <FaArrowLeft />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-(--foreground)">Checkout</h1>
          <div className="w-32" />
        </div> */}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card className="p-4 border border-(--border) rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-(--foreground)">Customer Information</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="email">Full Name</label>
                  <div
                    className={`border border-(--border) rounded-lg flex items-center mt-2 h-10`}
                  >
                    <FaUser className="h-5 w-5 ml-2 text-(--muted-foreground)" />
                    <Input
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      isRequired
                      classNames={{
                        base: "flex-1",
                        inputWrapper: "h-9 bg-transparent shadow-none border-none focus-within:ring-0 focus-within:outline-none",
                        input: "h-9 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email">Email address</label>
                  <div
                    className={`border border-(--border) rounded-lg flex items-center mt-2 h-10`}
                  >
                    <FaEnvelope className="h-5 w-5 ml-2 text-(--muted-foreground)" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      isRequired
                      classNames={{
                        base: "flex-1",
                        inputWrapper: "h-9 bg-transparent shadow-none border-none focus-within:ring-0 focus-within:outline-none",
                        input: "h-9 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                      }}
                    />
                  </div>
                </div>


                <div className="space-y-2">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <div
                    className={`border border-(--border) rounded-lg flex items-center mt-2 h-10`}
                  >
                    <FaPhone className="h-5 w-5 ml-2 text-(--muted-foreground)" />
                    <Input
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      isRequired
                      classNames={{
                        base: "flex-1",
                        inputWrapper: "h-9 bg-transparent shadow-none border-none focus-within:ring-0 focus-within:outline-none",
                        input: "h-9 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="Address">Address</label>
                  <div
                    className={`border border-(--border) rounded-lg flex items-center mt-2 h-10`}
                  >
                    <FaMapMarkerAlt className="h-5 w-5 ml-2 text-(--muted-foreground)" />
                    <Input
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      isRequired
                      classNames={{
                        base: "flex-1",
                        inputWrapper: "h-9 bg-transparent shadow-none border-none focus-within:ring-0 focus-within:outline-none",
                        input: "h-9 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Order Items */}
            <Card className="p-4 border border-(--border) rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-(--foreground)">Order Items</h2>

              <div className="space-y-4">
                {cartItems.map((item: CartItem, index: number) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-(--border) last:border-b-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-40 h-40 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-(--foreground)">{item.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-(--muted-foreground) mt-1">
                        <BiCalendar size={14} />
                        <span>{item.duration}</span>
                      </div>
                      <div className="text-sm text-(--muted-foreground)">
                        {item.startLocation} → {item.endLocation}
                      </div>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-semibold text-(--primary)">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-sm text-(--muted-foreground) line-through">
                          ₹{item.originalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 p-6 shadow-lg rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-(--foreground)">Payment Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-(--muted-foreground)">Subtotal ({cartItems.length} items)</span>
                  <span className="text-(--foreground)">₹{calculateOriginalTotal().toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{calculateTotalSavings().toLocaleString("en-IN")}</span>
                </div>
                <div className="border-t border-(--border) pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-(--foreground)">Total</span>
                    <span className="text-(--primary)">₹{calculateTotal().toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              <div className="bg-(--secondary) p-3 rounded-lg mb-6 border border-(--border)">
                <p className="text-sm text-(--muted-foreground)">
                  You're saving <span className="font-semibold text-green-600">₹{calculateTotalSavings().toLocaleString("en-IN")}</span> on this booking!
                </p>
              </div>

              <Button
                className="w-full bg-(--primary) text-(--primary-foreground) rounded-lg flex items-center justify-center gap-2"
                size="lg"
                onPress={handlePayment}
                isLoading={processingPayment}
                disabled={processingPayment}
              >
                <FaCreditCard />
                {processingPayment ? 'Processing...' : 'Pay Now'}
              </Button>

              <p className="text-xs text-(--muted-foreground) text-center mt-4">
                Secure payment powered by Razorpay
              </p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
