import { Router, Request, Response } from "express";
import { packageService } from "../../services/package-service";
import { UserModel } from "../../models/user-model";

const router = Router();

// Decode the base64 token and return userId, or null if invalid
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

// Get all packages (with optional filters)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { agentId, search, minPrice, maxPrice } = req.query;

    let query: any = { isActive: true };

    if (agentId) {
      query.agentId = agentId;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { destinations: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const result = await packageService.get_all({ query });
    let packages: any[] = result.data as any[];
    const totalItems = result.totalItems;

    // Check user type — travellers get packages without itinerary
    const userId = getUserIdFromToken(req);
    if (userId) {
      const user = await UserModel.findById(userId).select("userType").lean();
      if (user?.userType === "traveller") {
        packages = packages.map(({ itinerary, ...rest }) => rest);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        data: packages,
        totalItems,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch packages",
    });
  }
});

// Get package by ID
router.get("/:packageId", async (req: Request, res: Response) => {
  try {
    const { packageId } = req.params;
    const pkg = await packageService.model.findById(packageId);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: pkg,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch package",
    });
  }
});

// Create package (agent only)
router.post("/", async (req: Request, res: Response) => {
  try {
    const packageData = req.body;
    
    const pkg = await packageService.model.create(packageData);

    return res.status(201).json({
      success: true,
      data: pkg,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create package",
    });
  }
});

// Update package (agent only)
router.put("/:packageId", async (req: Request, res: Response) => {
  try {
    const { packageId } = req.params;
    const updateData = req.body;

    const pkg = await packageService.model.findByIdAndUpdate(
      packageId,
      updateData,
      { new: true },
    );

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: pkg,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update package",
    });
  }
});

// Delete package (agent only)
router.delete("/:packageId", async (req: Request, res: Response) => {
  try {
    const { packageId } = req.params;

    const pkg = await packageService.model.findById(packageId);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    await pkg.delete();

    return res.status(200).json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete package",
    });
  }
});

export default router;
