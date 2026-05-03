import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import { BookingModel } from "../../models/booking-model";
import { BankDetailModel } from "../../models/bank-detail-model";

const router = Router();

// GET /api/earnings/:agentId — earnings summary + per-booking breakdown
router.get("/:agentId", async (req: Request, res: Response) => {
  try {
    const agentId = req.params.agentId as string;

    if (!Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({ success: false, message: "Invalid agentId" });
    }

    const bookings = await BookingModel.find({ agentId: new Types.ObjectId(agentId) })
      .populate("packageId", "title")
      .sort({ createdAt: -1 })
      .lean();

    const commissionRate = 15;

    const earnings = bookings.map((b: any) => ({
      _id: b._id,
      tripTitle: b.packageId?.title ?? "Unknown Package",
      amount: b.totalPrice,
      date: b.bookingDate ?? b.createdAt,
      status: b.status === "completed" ? "paid" : b.status === "cancelled" ? "cancelled" : "pending",
      numberOfTravellers: b.numberOfTravellers,
    }));

    const totalEarnings = earnings.reduce((s, e) => s + e.amount, 0);
    const totalPaid = earnings.filter(e => e.status === "paid").reduce((s, e) => s + e.amount, 0);
    const totalPending = earnings.filter(e => e.status === "pending").reduce((s, e) => s + e.amount, 0);
    const platformFee = totalEarnings * (commissionRate / 100);
    const netEarnings = totalEarnings - platformFee;

    // Monthly breakdown
    const monthMap: Record<string, { month: string; amount: number; status: string; date: Date | null }> = {};
    for (const e of earnings) {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d.toLocaleString("default", { month: "long", year: "numeric" });
      if (!monthMap[key]) {
        monthMap[key] = { month: label, amount: 0, status: e.status, date: d };
      }
      monthMap[key].amount += e.amount;
      if (e.status === "pending") monthMap[key].status = "pending";
    }
    const monthlyPayouts = Object.values(monthMap).reverse();

    return res.status(200).json({
      success: true,
      data: {
        earnings,
        monthlyPayouts,
        summary: { totalEarnings, totalPaid, totalPending, platformFee, netEarnings, commissionRate },
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch earnings",
    });
  }
});

// GET /api/earnings/bank/:agentId
router.get("/bank/:agentId", async (req: Request, res: Response) => {
  try {
    const agentId = req.params.agentId as string;
    const detail = await BankDetailModel.findOne({ agentId: new Types.ObjectId(agentId) }).lean();
    return res.status(200).json({ success: true, data: detail ?? null });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Failed to fetch bank details" });
  }
});

// POST /api/earnings/bank — create bank details
router.post("/bank", async (req: Request, res: Response) => {
  try {
    const { agentId, accountHolderName, bankName, accountNumber, ifscCode, branchName } = req.body;
    if (!agentId || !accountHolderName || !bankName || !accountNumber || !ifscCode) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }
    const existing = await BankDetailModel.findOne({ agentId: new Types.ObjectId(agentId) });
    if (existing) {
      return res.status(409).json({ success: false, message: "Bank details already exist. Use PUT to update." });
    }
    const detail = await BankDetailModel.create({ agentId, accountHolderName, bankName, accountNumber, ifscCode, branchName });
    return res.status(201).json({ success: true, data: detail });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Failed to save bank details" });
  }
});

// PUT /api/earnings/bank/:agentId — update bank details
router.put("/bank/:agentId", async (req: Request, res: Response) => {
  try {
    const agentId = req.params.agentId as string;
    const { accountHolderName, bankName, accountNumber, ifscCode, branchName } = req.body;
    const detail = await BankDetailModel.findOneAndUpdate(
      { agentId: new Types.ObjectId(agentId) },
      { accountHolderName, bankName, accountNumber, ifscCode, branchName },
      { new: true, upsert: true }
    );
    return res.status(200).json({ success: true, data: detail });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Failed to update bank details" });
  }
});

export default router;
