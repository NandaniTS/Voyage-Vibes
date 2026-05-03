import { Router, Request, Response } from "express";
import { CartService } from "../../services/cart-service";

const router = Router();
const cartService = new CartService();

// Add item to cart
router.post("/add", async (req: Request, res: Response) => {
  try {
    const { userId, item } = req.body;

    if (!userId || !item) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const cart = await cartService.addItemToCart(userId, item);

    return res.status(201).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to add item to cart";
    const statusCode = errorMessage === "Package already in cart" ? 409 : 400;
    
    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
});

// Remove item from cart
router.delete("/remove", async (req: Request, res: Response) => {
  try {
    const { userId, packageId } = req.body;

    if (!userId || !packageId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const cart = await cartService.removeItemFromCart(userId, packageId);

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to remove item from cart",
    });
  }
});

// Get user's cart
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const cart = await cartService.getCartByUserId(userId as string);

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [] },
      });
    }

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch cart",
    });
  }
});

// Clear cart
router.delete("/clear/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const cart = await cartService.clearCart(userId as string);

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to clear cart",
    });
  }
});

export default router;
