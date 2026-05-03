"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { packageApiWithSession } from "../../../../../services/packages";
import { cartApiWithSession } from "../../../../../services/cart";
import { bookingApiWithSession } from "../../../../../services/booking";
import { useParams, useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import { FaMapPin, FaMountain, FaUsers, FaShoppingCart, FaStar } from "react-icons/fa";
import { BiCalendar, BiHeart, BiMapPin, BiStar } from "react-icons/bi";
import toast from "react-hot-toast";
import { useAuth } from "../../../../lib/auth-context";

const page = () => {
  const params = useParams();
  const router = useRouter();
  const viewId = params.viewId;

  const user = useAuth()
  const queryClient = useQueryClient()

  const getPackageDetailByIdQuery = useQuery({
    queryKey: ["get-package-detail-by-id", viewId],
    queryFn: async () => {
      return (
        await packageApiWithSession.get_by_id({
          _id: viewId as string,
        })
      ).data;
    },
    enabled: !!viewId,
  });

  const travelData = getPackageDetailByIdQuery.data;

  const [selectedDate, setSelectedDate] = useState(travelData?.availableDates?.[0]);

  // Update selectedDate when travelData loads
  React.useEffect(() => {
    if (travelData?.availableDates?.[0] && !selectedDate) {
      setSelectedDate(travelData.availableDates[0]);
    }
  }, [travelData, selectedDate]);

  // Get user cart to check if item is already in cart
  const getUserCartQuery = useQuery({
    queryKey: ["get-user-cart", user?.user?._id],
    queryFn: async () => {
      if (!user?.user?._id) return null;
      return (await cartApiWithSession.getUserCart(user?.user?._id)).data;
    },
    enabled: !!user?.user?._id,
  });

  const isInCart = (getUserCartQuery?.data as any)?.items?.some(
    (item: any) => item.packageId === travelData?._id
  ) || false;

  // Check if user already booked this package
  const alreadyBookedQuery = useQuery({
    queryKey: ["check-already-booked", user?.user?._id, viewId],
    queryFn: async () => {
      const res = await bookingApiWithSession.checkAlreadyBooked(
        user?.user?._id as string,
        viewId as string
      );
      return (res.data as any)?.alreadyBooked as boolean;
    },
    enabled: !!user?.user?._id && !!viewId,
  });

  const alreadyBooked = alreadyBookedQuery.data === true;

  const discount = Math.round(
    (((travelData?.price || 0) - (travelData?.disountPrice || 0)) /
      (travelData?.price || 0)) *
      100,
  );

  const addToCartMutation = useMutation({
    mutationFn: async (cartItem: any) => {
      // Get user ID from auth context first
      let userId = user?.user?._id;
      
      // If not available in auth context, try to get from localStorage
      if (!userId) {
        const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : "";
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            userId = userData._id;
          } catch (error) {
            console.error("Failed to parse user data:", error);
          }
        }
      }
      
      if (!userId) {
        throw new Error("Please login to add items to cart");
      }
      
      return await cartApiWithSession.addToCart({
        userId: userId as string,
        item: cartItem
      });
    },
    onSuccess: () => {
      toast.success('Package added to cart successfully!');
      queryClient.invalidateQueries({
        queryKey: ["user-cart","get-user-cart", user?.user?._id]
      });
    },
    onError: (error: any) => {
      if (error.message === "Please login to add items to cart") {
        toast.error('Please login to add items to cart');
        // window.location.href = '/auth/login';
      } else if (error.response?.data?.message === "Package already in cart") {
        toast.error('This package is already in your cart!');
      } else {
        toast.error('Failed to add package to cart');
      }
    }
  });

  const addToCart = () => {
    
    if (!travelData || !selectedDate) return;
    const cartItem = {
      packageId: travelData._id,
      title: travelData.title,
      price: travelData.disountPrice || travelData.price,
      originalPrice: travelData.price,
      image: travelData.images?.[0] || "/placeholder-image.jpg",
      duration: `${travelData.noOfDays}D/${travelData.noOfNights}N`,
      startDate: selectedDate.startDate,
      endDate: selectedDate.endDate,
      seatsAvailable: selectedDate.seatsAvailable,
      category: travelData.category?.[0],
      startLocation: travelData.startLocation,
      endLocation: travelData.endLocation
    };

    addToCartMutation.mutate(cartItem);
  };

  return (
    <main className="overflow-y-scroll h-full bg-(--background) p-4">
      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={travelData?.images?.[0] || "/placeholder-image.jpg"}
          alt={travelData?.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/60" />
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block bg-(--accent) px-3 py-1 text-sm font-semibold text-(--accent-foreground) rounded-full">
                {travelData?.category?.[0]}
              </span>
            </div>
            <button className="rounded-full bg-white/90 p-2 transition-all hover:bg-white">
              <BiHeart size={24} />
            </button>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-balance">
              {travelData?.title}
            </h1>
            <p className="text-white/90 max-w-2xl">{travelData?.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
              {[
                {
                  icon: <BiCalendar size={20} className="text-(--primary)" />,
                  label: "Duration",
                  value: `${travelData?.noOfDays}D/${travelData?.noOfNights}N`,
                },
                {
                  icon: <FaMapPin size={20} className="text-(--primary)" />,
                  label: "Destinations",
                  value: travelData?.destinations?.length,
                },
                {
                  icon: <FaUsers size={20} className="text-(--primary)" />,
                  label: "Min Age",
                  value: `${travelData?.minAge}+`,
                },
                {
                  icon: <FaMountain size={20} className="text-(--primary)" />,
                  label: "Seats Left",
                  value: selectedDate?.seatsAvailable ?? "—",
                },
              ].map((stat, i) => (
                <Card key={i} className="p-4 border border-(--border) rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    {stat.icon}
                    <span className="text-sm text-(--muted-foreground)">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-(--foreground)">{stat.value}</p>
                </Card>
              ))}
            </div>

            {/* Destinations */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-(--foreground)">Destinations</h2>
              <div className="flex flex-wrap gap-3">
                {travelData?.destinations?.map((destination, idx) => (
                  <span
                    key={idx}
                    className="bg-(--secondary) px-4 py-2 rounded-full text-(--secondary-foreground) font-medium text-sm"
                  >
                    {destination}
                  </span>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-(--foreground)">Your Adventure Itinerary</h2>
              <div className="space-y-4">
                {travelData?.itinerary?.map((day, idx) => (
                  <Card key={idx} className="p-4 border border-(--border) rounded-lg hover:shadow-lg transition-shadow">
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--primary) text-(--primary-foreground) font-bold text-lg">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1 text-(--foreground)">{day.title}</h3>
                        <p className="text-(--muted-foreground)">{day.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Route */}
            <div className="bg-(--secondary) rounded-lg p-6 border border-(--border)">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-(--foreground)">
                <FaMapPin size={20} className="text-(--primary)" />
                Journey Route
              </h3>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-sm text-(--muted-foreground) mb-1">Start Point</p>
                  <p className="font-bold text-lg text-(--foreground)">{travelData?.startLocation}</p>
                </div>
                <div className="flex-1 mx-4 border-t-2 border-(--border) border-dashed" />
                <div className="text-center">
                  <p className="text-sm text-(--muted-foreground) mb-1">End Point</p>
                  <p className="font-bold text-lg text-(--foreground)">{travelData?.endLocation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 p-6 shadow-lg">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-(--primary)">
                    ₹{travelData?.disountPrice?.toLocaleString("en-IN")}
                  </span>
                  <span className="text-lg text-(--muted-foreground) line-through">
                    ₹{travelData?.price?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="inline-block bg-(--accent) text-(--accent-foreground) px-3 py-1 rounded-full text-sm font-semibold">
                  {discount}% OFF
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-(--foreground)">
                  Select Dates
                </label>
                <div className="bg-(--secondary) p-4 rounded-lg border border-(--border)">
                  <p className="text-sm text-(--muted-foreground) mb-1">Check-in</p>
                  <p className="font-semibold mb-3 text-(--foreground)">
                    {selectedDate?.startDate
                      ? new Date(selectedDate.startDate.toString()).toLocaleDateString("en-IN", {
                          month: "short", day: "numeric", year: "numeric",
                        })
                      : "—"}
                  </p>
                  <p className="text-sm text-(--muted-foreground) mb-1">Check-out</p>
                  <p className="font-semibold text-(--foreground)">
                    {selectedDate?.endDate
                      ? new Date(selectedDate.endDate.toString()).toLocaleDateString("en-IN", {
                          month: "short", day: "numeric", year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6 p-3 bg-(--secondary) rounded-lg border border-(--border)">
                <p className="text-sm text-(--muted-foreground) mb-1">Seats Available</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-(--border) rounded-full overflow-hidden">
                    <div
                      className="h-full bg-(--accent)"
                      style={{
                        width: `${((selectedDate?.seatsAvailable ?? 0) / 20) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-semibold text-(--foreground)">
                    {selectedDate?.seatsAvailable ?? 0}/20
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              {alreadyBooked ? (
                <Button
                  className="w-full mb-3 rounded-lg"
                  size="lg"
                  disabled
                  variant="flat"
                >
                  Already Booked
                </Button>
              ) : (
                <Button
                  className="w-full mb-3 bg-(--primary) text-(--primary-foreground) rounded-lg"
                  size="lg"
                >
                  Book Now
                </Button>
              )}
              {!alreadyBooked && (isInCart ? (
                <Button 
                  className="w-full border border-(--border) text-(--foreground) rounded-lg  flex items-center justify-center gap-2" 
                  size="lg" 
                  variant="bordered"
                  onPress={() => router.push('/traveller/cart')}
                >
                  <FaShoppingCart className="mr-2" />
                  Go to Cart
                </Button>
              ) : (
                <Button 
                  className="w-full border border-(--border) text-(--foreground) rounded-lg flex items-center justify-center gap-2" 
                  size="lg" 
                  variant="bordered"
                  onPress={addToCart}
                  disabled={!travelData || !selectedDate || addToCartMutation.isPending}
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </Button>
              ))}

              <p className="text-xs text-(--muted-foreground) text-center mt-4">
                Price per person • Free cancellation up to 7 days
              </p>
              
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
