"use client";

import { Button, Card } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { BiCalendar, BiHeart } from "react-icons/bi";
import { FaCheck, FaMapPin, FaMountain, FaTrash, FaUsers } from "react-icons/fa";
import { packageApiWithSession } from "../../../../../services/packages";
import { useAuth } from "../../../../lib/auth-context";
import { TUpdatePackageRequest } from "@repo/definitions";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";

const Page = () => {
    
    const params = useParams();
    const router = useRouter();
    const viewId = params.viewId;

    const user = useAuth()

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

    const discount = Math.round(
        (((travelData?.price || 0) - (travelData?.disountPrice || 0)) /
            (travelData?.price || 0)) *
        100,
    );


    const updatePackageMutation = useMutation({
        mutationFn: async (data: TUpdatePackageRequest) => {
            return (await packageApiWithSession.update(data))
        },
        onSuccess: () => {
            toast.success("Package updated successfully");
        }
    })


    const handleInactive = (packageId: string) => {
        updatePackageMutation.mutate({
            _id: packageId,
            isActive: false
        });
    };

    const handleActive = (packageId: string) => {
        updatePackageMutation.mutate({
            _id: packageId,
            isActive: true
        });
    };

    const remainingDays = (travelData?.totalSeats || 0) - (travelData?.availableSeats || 0);

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

            {/* Image Gallery */}
            {(travelData?.images?.length ?? 0) > 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {travelData?.images?.map((img, idx) => (
                        <div key={idx} className="relative h-40 overflow-hidden rounded-lg">
                            <img
                                src={img}
                                alt={`${travelData?.title} - image ${idx + 1}`}
                                className="h-full w-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Main Content */}
            <div className="mx-auto px-4 py-12 ">
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
                                    value: travelData?.availableSeats ?? "—",
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
                                                width: `${((remainingDays ?? 0) / (travelData?.totalSeats ?? 1)) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="font-semibold text-(--foreground)">
                                        {remainingDays ?? 0}/{travelData?.totalSeats}
                                    </span>
                                </div>
                            </div>

                            {
                                travelData?.isActive ? (
                                    <Button
                                        size="sm"
                                        variant="bordered"
                                        color="danger"
                                        className="flex gap-2 justify-center w-full rounded-lg items-center border border-(--border) text-red-400 hover:bg-red-400 hover:text-(--primary-foreground) "
                                        onPress={() => handleInactive(travelData?._id as string)}
                                    >
                                        <RxCross2 className="w-4 h-4" />
                                        Mark as Inactive
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="bordered"
                                        className="flex gap-2 justify-center w-full rounded-lg items-center border border-(--border) text-green-400 hover:bg-green-400 hover:text-(--primary-foreground) "
                                        onPress={() => handleActive(travelData?._id as string)}
                                    >
                                        <FaCheck className="w-4 h-4" />
                                        Mark as active
                                    </Button>
                                )
                            }

                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Page;
