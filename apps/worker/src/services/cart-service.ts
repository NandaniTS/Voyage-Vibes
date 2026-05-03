import { Cart, ICart, ICartItem } from "../models/cart-model";
import { Types } from "mongoose";

export class CartService {
  // Get cart by user ID
  async getCartByUserId(userId: string): Promise<ICart | null> {
    return await Cart.findOne({ userId, isActive: true });
  }

  // Create or update cart
  async createOrUpdateCart(cartData: { userId: string; items: ICartItem[] }): Promise<ICart> {
    const existingCart = await Cart.findOne({ 
      userId: cartData.userId, 
      isActive: true 
    });

    if (existingCart) {
      // Update existing cart
      const updatedCart = await Cart.findByIdAndUpdate(
        existingCart._id,
        { 
          $push: { items: cartData.items },
          updatedAt: new Date()
        },
        { new: true }
      );
      if (!updatedCart) {
        throw new Error("Failed to update cart");
      }
      return updatedCart;
    } else {
      // Create new cart
      const newCart = new Cart({
        userId: cartData.userId,
        items: cartData.items,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return await newCart.save();
    }
  }

  // Add item to cart
  async addItemToCart(userId: string, item: ICartItem): Promise<ICart> {
    // Validate package ID format
    if (!item.packageId || !Types.ObjectId.isValid(item.packageId)) {
      throw new Error(`Invalid package ID format: ${item.packageId}. Must be a valid MongoDB ObjectId.`);
    }
    
    const cart = await this.getCartByUserId(userId);
    
    if (!cart) {
      // Create new cart with item
      const newCart = new Cart({
        userId,
        items: [item],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return await newCart.save();
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (cartItem: ICartItem) => cartItem.packageId === item.packageId
    );

    if (existingItemIndex > -1) {
      throw new Error("Package already in cart");
    }

    // Add item to existing cart
    cart.items.push(item);
    cart.updatedAt = new Date();
    return await cart.save();
  }

  // Remove item from cart
  async removeItemFromCart(userId: string, packageId: string): Promise<ICart | null> {
    const cart = await this.getCartByUserId(userId);
    
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = cart.items.filter((item: ICartItem) => item.packageId !== packageId);
    cart.updatedAt = new Date();
    return await cart.save();
  }

  // Clear cart
  async clearCart(userId: string): Promise<ICart | null> {
    const cart = await this.getCartByUserId(userId);
    
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = [];
    cart.updatedAt = new Date();
    return await cart.save();
  }

  // Delete cart (set inactive)
  async deleteCart(userId: string): Promise<void> {
    await Cart.updateOne(
      { userId },
      { 
        isActive: false,
        updatedAt: new Date()
      }
    );
  }
}
