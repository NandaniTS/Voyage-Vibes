"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import {
  FaArrowLeft,
  FaCalendar,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTimesCircle,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { bookingApiWithSession } from "../../../../../services/booking";

const statusConfig = {
  pending: { color: "warning" as const, icon: FaClock, label: "Pending" },
  confirmed: { color: "success" as const, icon: FaCheckCircle, label: "Confirmed" },
  completed: { color: "primary" as const, icon: FaCheckCircle, label: "Completed" },
  cancelled: { color: "danger" as const, icon: FaTimesCircle, label: "Cancelled" },
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const viewId = params.viewId as string;

  const bookingQuery = useQuery({
    queryKey: ["get-booking-by-id", viewId],
    queryFn: async () => {
      const res = await bookingApiWithSession.get_by_id({ _id: viewId,
        query:{
            populate:[
                {
                    path:"agentId"
                }
            ]
        }
       });
      return res.data as any;
    },
    enabled: !!viewId,
  });

  const booking = bookingQuery.data;
  const pkg = booking?.package;
  const agent = booking?.agent;

  const status = booking?.status
    ? statusConfig[booking.status as keyof typeof statusConfig]
    : null;
  const StatusIcon = status?.icon ?? FaClock;

  if (bookingQuery.isPending) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-(--muted) rounded animate-pulse" />
        <div className="h-64 bg-(--muted) rounded-lg animate-pulse" />
        <div className="h-40 bg-(--muted) rounded-lg animate-pulse" />
      </div>
    );
  }

  if (bookingQuery.isError || !booking) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full gap-4">
        <p className="text-(--muted-foreground) text-lg">Booking not found.</p>
        <Button
          size="sm"
          className="bg-(--primary) text-(--primary-foreground) rounded-lg"
          onPress={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 overflow-y-scroll h-full">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-(--muted-foreground) hover:text-(--foreground) transition-colors text-sm"
      >
        <FaArrowLeft className="w-4 h-4" />
        Back to Bookings
      </button>

      {/* Hero image + title */}
      {pkg?.images?.[0] && (
        <div className="relative h-56 w-full overflow-hidden rounded-lg">
          <img
            src={pkg.images[0]}
            alt={pkg.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h1 className="text-2xl font-serif font-bold text-white">{pkg.title}</h1>
            {pkg.destinations?.length > 0 && (
              <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
                <FaMapMarkerAlt className="w-3 h-3" />
                {pkg.destinations.join(" · ")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status + Booking ID */}
      <Card className="border border-(--border) rounded-lg">
        <CardBody className="p-4 flex flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-(--muted-foreground) mb-1">Booking ID</p>
            <p className="font-mono text-sm text-(--foreground)">{booking._id}</p>
          </div>
          {status && (
            <Chip
              color={status.color}
              variant="flat"
              startContent={<StatusIcon className="w-4 h-4" />}
              className="flex items-center gap-2 px-2 border border-(--border)"
            >
              {status.label}
            </Chip>
          )}
        </CardBody>
      </Card>

      {/* Trip details */}
      <Card className="border border-(--border) rounded-lg">
        <CardBody className="p-4 space-y-4">
          <h2 className="font-semibold text-(--foreground)">Trip Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-(--muted-foreground) mb-1 flex items-center gap-1">
                <FaCalendar className="w-3 h-3" /> Start Date
              </p>
              <p className="font-medium text-(--foreground)">
                {booking.startDate
                  ? new Date(booking.startDate).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-(--muted-foreground) mb-1 flex items-center gap-1">
                <FaCalendar className="w-3 h-3" /> End Date
              </p>
              <p className="font-medium text-(--foreground)">
                {booking.endDate
                  ? new Date(booking.endDate).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-(--muted-foreground) mb-1 flex items-center gap-1">
                <FaUsers className="w-3 h-3" /> Travellers
              </p>
              <p className="font-medium text-(--foreground)">{booking.noOfTravellers ?? "1"}</p>
            </div>
            <div>
              <p className="text-(--muted-foreground) mb-1 flex items-center gap-1">
                <FaCalendar className="w-3 h-3" /> Booked On
              </p>
              <p className="font-medium text-(--foreground)">
                {booking.bookingDate
                  ? new Date(booking.bookingDate).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>

          {booking.specialRequests && (
            <div>
              <p className="text-(--muted-foreground) text-sm mb-1">Special Requests</p>
              <p className="text-sm text-(--foreground) bg-(--muted) rounded-lg p-3">
                {booking.specialRequests}
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Price */}
      <Card className="border border-(--border) rounded-lg">
        <CardBody className="p-4 flex flex-row items-center justify-between">
          <p className="text-(--muted-foreground) text-sm">Total Price</p>
          <p className="text-2xl font-bold text-(--primary)">₹{booking.totalPrice?.toLocaleString("en-IN")}</p>
        </CardBody>
      </Card>

      {/* Agent info */}
      {agent && (
        <Card className="border border-(--border) rounded-lg">
          <CardBody className="p-4 space-y-3">
            <h2 className="font-semibold text-(--foreground)">Your Agent</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-(--muted) flex items-center justify-center">
                <FaUser className="w-4 h-4 text-(--muted-foreground)" />
              </div>
              <div>
                <p className="font-medium text-(--foreground)">{agent.fullName}</p>
                <div className="flex items-center gap-1 text-sm text-(--muted-foreground)">
                  <FaEnvelope className="w-3 h-3" />
                  {agent.email}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
