import { Router, Request, Response } from "express";
import { UserModel } from "../../models/user-model";

const router = Router();

function getUserIdFromToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.slice(7);
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
    return payload.userId ?? null;
  } catch {
    return null;
  }
}

async function requireAdmin(req: Request, res: Response): Promise<boolean> {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return false;
  }
  const user = await UserModel.findById(userId).lean();
  if (!user || user.userType !== "admin") {
    res.status(403).json({ success: false, message: "Forbidden: Admins only" });
    return false;
  }
  return true;
}

// GET /api/admin/users?userType=agent|traveller
router.get("/users", async (req: Request, res: Response) => {
  try {
    if (!(await requireAdmin(req, res))) return;

    const { userType } = req.query;
    const filter: Record<string, unknown> = {};
    if (userType) filter.userType = userType;

    const [users, totalItems] = await Promise.all([
      UserModel.find(filter).select("-password").lean(),
      UserModel.countDocuments(filter),
    ]);

    return res.status(200).json({ success: true, data: {
      data: users,
      totalItems,
    } });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch users",
    });
  }
});

// PUT /api/admin/bank-details  — admin updates their own bank details
router.put("/bank-details", async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await UserModel.findById(userId).lean();
    if (!user || user.userType !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden: Admins only" });
    }

    const { accountHolderName, accountNumber, bankName, ifscCode } = req.body;
    if (!accountHolderName || !accountNumber || !bankName || !ifscCode) {
      return res.status(400).json({ success: false, message: "All bank detail fields are required" });
    }

    const updated = await UserModel.findByIdAndUpdate(
      userId,
      { bankDetails: { accountHolderName, accountNumber, bankName, ifscCode } },
      { new: true }
    ).select("-password").lean();

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update bank details",
    });
  }
});

// GET /api/admin/me — get admin profile with bank details
router.get("/me", async (req: Request, res: Response) => {
  try {
    if (!(await requireAdmin(req, res))) return;
    const userId = getUserIdFromToken(req);
    const user = await UserModel.findById(userId).select("-password").lean();
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
});

// PUT /api/admin/users/:id/suspend — toggle suspend status
router.put("/users/:id/suspend", async (req: Request, res: Response) => {
  try {
    if (!(await requireAdmin(req, res))) return;

    const { id } = req.params;
    const { isSuspended } = req.body;

    if (typeof isSuspended !== "boolean") {
      return res.status(400).json({ success: false, message: "isSuspended must be a boolean" });
    }

    const updated = await UserModel.findByIdAndUpdate(
      id,
      { isSuspended },
      { new: true }
    ).select("-password").lean();

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update user",
    });
  }
});

export default router;
