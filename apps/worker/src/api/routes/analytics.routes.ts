import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import { BookingModel } from "../../models/booking-model";
import { ReviewModel } from "../../models/review-model";
import { PackageModel } from "../../models/package-model";

const router = Router();

// GET /api/analytics/:agentId
router.get("/:agentId", async (req: Request, res: Response) => {
  try {
    const agentId = req.params.agentId as string;

    if (!Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({ success: false, message: "Invalid agentId" });
    }

    const oid = new Types.ObjectId(agentId);

    const [bookings, reviews, packages] = await Promise.all([
      BookingModel.find({ agentId: oid })
        .populate("packageId", "title")
        .sort({ createdAt: -1 })
        .lean(),
      ReviewModel.find({})
        .populate({ path: "packageId", match: { agentId: oid }, select: "title" })
        .populate("userId", "fullName")
        .sort({ createdAt: -1 })
        .lean(),
      PackageModel.find({ agentId: oid } as any).lean(),
    ]);

    // KPIs
    const totalRevenue = bookings.reduce((s, b) => s + (b.totalPrice ?? 0), 0);
    const totalBookings = bookings.length;
    const activePackages = packages.filter((p) => p.isActive !== false).length;

    const agentReviews = reviews.filter((r) => r.packageId !== null);
    const totalReviews = agentReviews.length;
    const avgRating =
      totalReviews > 0
        ? Math.round((agentReviews.reduce((s, r) => s + (r.rating ?? 0), 0) / totalReviews) * 10) / 10
        : 0;

    // Recent bookings (last 5)
    const recentBookings = bookings.slice(0, 5).map((b: any) => ({
      _id: b._id,
      packageTitle: b.packageId?.title ?? "Unknown Package",
      totalPrice: b.totalPrice,
      status: b.status,
      createdAt: b.createdAt,
    }));

    // Recent reviews (last 5)
    const recentReviews = agentReviews.slice(0, 5).map((r: any) => ({
      _id: r._id,
      packageTitle: r.packageId?.title ?? "Unknown Package",
      rating: r.rating,
      comment: r.comment,
      reviewerName: r.userId?.fullName ?? "Anonymous",
      createdAt: r.createdAt,
    }));

    // Top packages by revenue
    const pkgMap: Record<string, { title: string; bookings: number; revenue: number }> = {};
    for (const b of bookings as any[]) {
      const id = b.packageId?._id?.toString() ?? "unknown";
      const title = b.packageId?.title ?? "Unknown Package";
      if (!pkgMap[id]) pkgMap[id] = { title, bookings: 0, revenue: 0 };
      pkgMap[id].bookings += 1;
      pkgMap[id].revenue += b.totalPrice ?? 0;
    }
    const topPackages = Object.values(pkgMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Monthly revenue (last 6 months)
    const now = new Date();
    const monthlyRevenue: { month: string; revenue: number; bookings: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("default", { month: "short", year: "numeric" });
      const monthBookings = (bookings as any[]).filter((b) => {
        const bd = new Date(b.createdAt);
        return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth();
      });
      monthlyRevenue.push({
        month: label,
        revenue: monthBookings.reduce((s, b) => s + (b.totalPrice ?? 0), 0),
        bookings: monthBookings.length,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        kpis: { totalRevenue, totalBookings, activePackages, avgRating, totalReviews },
        recentBookings,
        recentReviews,
        topPackages,
        monthlyRevenue,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch analytics",
    });
  }
});

export default router;
