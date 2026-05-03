"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import { FaTrash, FaArrowLeft, FaShoppingCart, FaCreditCard } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";
import toast from "react-hot-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { cartApiWithSession } from "../../../../services/cart";
import { useAuth } from "../../../lib/auth-context";

interface CartItem {
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

const CartPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  // Get user ID from auth context
  const userId = user?._id;

  const { data: cartData, isLoading, refetch } = useQuery({
    queryKey: ["user-cart", userId],
    queryFn: async () => {
      if (!userId) return { items: [] as CartItem[] };
      const response = await cartApiWithSession.getUserCart(userId);
      return response.data;
    },
    enabled: !!userId,
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (packageId: string) => {
      return await cartApiWithSession.removeFromCart({
        userId: userId!,
        packageId: packageId,
      });
    },
    onSuccess: () => {
      toast.success('Item removed from cart');
      refetch();
    },
    onError: () => {
      toast.error('Failed to remove item from cart');
    }
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return await cartApiWithSession.clearCart(userId!);
    },
    onSuccess: () => {
      toast.success('Cart cleared');
      refetch();
    },
    onError: () => {
      toast.error('Failed to clear cart');
    }
  });

  const cartItems = (cartData as any)?.items || [];

  const removeFromCart = (packageId: string) => {
    removeFromCartMutation.mutate(packageId);
  };

  const clearCart = () => {
    clearCartMutation.mutate();
  };

  const calculateTotal = () => {
    return cartItems.reduce((total: number, item: CartItem) => total + item.price, 0);
  };

  const calculateOriginalTotal = () => {
    return cartItems.reduce((total: number, item: CartItem) => total + item.originalPrice, 0);
  };

  const calculateTotalSavings = () => {
    return calculateOriginalTotal() - calculateTotal();
  };

  const proceedToPayment = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    router.push('/traveller/checkout');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-(--background) p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FaShoppingCart className="mx-auto text-4xl text-(--muted-foreground) mb-4" />
              <p className="text-(--muted-foreground)">Loading cart...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-(--background) p-4">
        <div className=" mx-auto">
          {/* <div className="flex items-center justify-between mb-8">
            <Button
              variant="light"
              onPress={() => router.back()}
              className="flex items-center gap-2"
            >
              <FaArrowLeft />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-(--foreground)">Shopping Cart</h1>
            <div className="w-20" />
          </div> */}

          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FaShoppingCart className="mx-auto text-6xl text-(--muted-foreground) mb-4" />
              <h2 className="text-2xl font-semibold text-(--foreground) mb-2">Your cart is empty</h2>
              <p className="text-(--muted-foreground) mb-6">Looks like you haven't added any packages yet</p>
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
      <div className="px-4 mx-auto">

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item: CartItem) => (
              <Card key={item.packageId} className="p-6 rounded-lg border border-(--border)">
                <div className="flex gap-6">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-(--foreground) mb-1">{item.title}</h3>
                        <span className="inline-block bg-(--accent) px-2 py-1 text-xs font-semibold text-(--accent-foreground) rounded-full">
                          {item.category}
                        </span>
                      </div>
                      <Button
                        variant="light"
                        color="danger"
                        size="sm"
                        onPress={() => removeFromCart(item.packageId)}
                        className="p-2"
                      >
                        <FaTrash />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-(--muted-foreground)">
                        <BiCalendar size={16} />
                        <span>{item.duration}</span>
                      </div>
                      <div className="text-(--muted-foreground)">
                        {item.startLocation} → {item.endLocation}
                      </div>
                    </div>

                    <div className="text-sm text-(--muted-foreground) mb-2">
                      {new Date(item.startDate).toLocaleDateString("en-IN", {
                        month: "short", day: "numeric", year: "numeric",
                      })} - {new Date(item.endDate).toLocaleDateString("en-IN", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-(--primary)">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-sm text-(--muted-foreground) line-through">
                          ₹{item.originalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="text-sm text-(--muted-foreground)">
                        {item.seatsAvailable} seats available
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 p-6 shadow-lg rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-(--foreground)">Order Summary</h2>
              
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
                className="w-full bg-(--primary) text-(--primary-foreground) rounded-lg mb-3 flex items-center justify-center gap-2"
                size="lg"
                onPress={proceedToPayment}
              >
                <FaCreditCard className="mr-2" />
                Proceed to Payment
              </Button>

              <Button
                className="w-full border border-(--border) text-(--foreground) rounded-lg"
                size="lg"
                variant="bordered"
                onPress={() => router.push('/traveller/browse')}
              >
                Continue Shopping
              </Button>

              <p className="text-xs text-(--muted-foreground) text-center mt-4">
                By proceeding, you agree to our terms and conditions
              </p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
