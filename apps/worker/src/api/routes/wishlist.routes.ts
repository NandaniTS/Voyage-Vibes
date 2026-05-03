import { Router, Request, Response } from "express";
import { WishlistService } from "../../services/wishlist-service";

const router = Router();
const wishlistService = new WishlistService();

// Add to wishlist
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, packageId } = req.body;

    if (!userId || !packageId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Package ID are required",
      });
    }

    const wishlistItem = await wishlistService.addToWishlist(userId, packageId);

    return res.status(201).json({
      success: true,
      data: wishlistItem,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to add to wishlist",
    });
  }
});

// Get user wishlist
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const populate = req.query.populate === "true";
    const wishlist = await wishlistService.getUserWishlist(userId as string, populate);

    return res.status(200).json({
      success: true,
      data: { 
        data: wishlist,
        totalItems: wishlist.length,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch wishlist",
    });
  }
});

// Check if package is in wishlist
router.get("/check/:userId/:packageId", async (req: Request, res: Response) => {
  try {
    const { userId, packageId } = req.params;
    const result = await wishlistService.checkInWishlist(userId as string, packageId as string);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to check wishlist",
    });
  }
});

// Remove from wishlist
router.delete("/:wishlistId", async (req: Request, res: Response) => {
  try {
    const { wishlistId } = req.params;
    const { userId } = req.body;
    
    if (!userId || !wishlistId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Wishlist ID are required",
      });
    }
    
    const result = await wishlistService.removeWishlistById(wishlistId as string, userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to remove from wishlist",
    });
  }
});

export default router;
