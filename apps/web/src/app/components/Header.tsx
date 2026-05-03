"use client";

import dayjs from "dayjs";
import { useAuth } from "../lib/auth-context";
import { usePathname } from "next/navigation";

const SEGMENT_LABELS: Record<string, string> = {
  browse: "Browse Trips",
  bookings: "My Bookings",
  wishlist: "Wishlist",
  reviews: "My Reviews",
  profile: "Profile",
  packages: "Trip Packages",
  analytics: "Analytics",
  earnings: "Earnings",
  create: "Create Package",
};

const MONGO_ID_RE = /^[a-f\d]{24}$/i;

const Header = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] ?? "";
  const parentSegment = segments[segments.length - 2] ?? "";

  const isMongoId = MONGO_ID_RE.test(lastSegment);

  let heading: string;
  if (isMongoId) {
    const parentLabel = SEGMENT_LABELS[parentSegment];
    heading = parentLabel ? `${parentLabel} — View` : "View";
  } else {
    heading = SEGMENT_LABELS[lastSegment] ?? lastSegment;
  }

  return (
    <div className="p-4 border-b border-(--border) h-19.5 flex justify-between items-center">
      <h1 className="text-2xl font-serif font-bold text-(--foreground) capitalize">
        {heading}
      </h1>
      <div className="flex justify-center items-center gap-4">
        <p>Hello, {user?.fullName}</p>
        <p className="border border-(--border) rounded-lg p-2">{dayjs().format("D MMMM, dddd, YYYY")}</p>
      </div>
    </div>
  );
};

export default Header;
