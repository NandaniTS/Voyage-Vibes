import { Router, Request, Response } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { BookingService } from "../../services";
import { CartService } from "../../services/cart-service";
import { PackageModel } from "../../models/package-model";

const payment = Router();

// Razorpay configuration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_SguoK4r0FdSp4D";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "jXSx1qdMdVozq8uGXYbjhMA3";

// Initialize Razorpay instance with error handling
let razorpay: Razorpay;

try {
  razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
  console.log("Razorpay initialized successfully with key:", RAZORPAY_KEY_ID);
} catch (error) {
  console.error("Failed to initialize Razorpay:", error);
  throw new Error("Razorpay initialization failed");
}

// Create order endpoint
payment.post("/create-order", async (req: Request, res: Response) => {
  try {
    const { amount, currency = "INR", receipt, notes } = req.body;

    // Validate required fields
    if (!amount || !receipt) {
      return res.status(400).json({
        success: false,
        message: "Amount and receipt are required",
      });
    }

    // Check if Razorpay is initialized
    if (!razorpay || !razorpay.orders) {
      console.error("Razorpay not properly initialized");
      return res.status(500).json({
        success: false,
        message: "Payment service not available",
        error: "Razorpay initialization failed"
      });
    }

    // Create Razorpay order
    const razorpayAmount = amount * 100; // Razorpay expects amount in paise
    // console.log("=== AMOUNT DEBUGGING ===");
    // console.log("Original amount (rupees):", amount);
    // console.log("Razorpay amount (paise):", razorpayAmount);
    // console.log("Cart items:", notes.items);
    // console.log("Cart total from notes:", notes.totalAmount);
    // console.log("Currency:", currency);
    // console.log("Receipt:", receipt);
    // console.log("Key ID:", RAZORPAY_KEY_ID);
    
    // Verify amount calculation
    const cartTotal = notes.items?.reduce((sum: number, item: any) => sum + item.price, 0) || 0;
    // console.log("Calculated cart total:", cartTotal);
    // console.log("Expected vs Actual:", {
    //   expected: notes.totalAmount,
    //   actual: amount,
    //   calculated: cartTotal
    // });
    
    if (amount !== notes.totalAmount) {
      console.error("AMOUNT MISMATCH DETECTED!");
      console.error("Expected:", notes.totalAmount, "Got:", amount);
    }
    
    // console.log("Creating Razorpay order with:", {
    //   amount: razorpayAmount,
    //   currency,
    //   receipt,
    //   notes,
    //   key_id: RAZORPAY_KEY_ID
    // });
    
    const order = await razorpay.orders.create({
      amount: razorpayAmount,
      currency,
      receipt,
      notes,
    });
    
    // console.log("Razorpay order created successfully:");
    // console.log("- Order ID:", order.id);
    // console.log("- Order Amount (paise):", order.amount);
    // console.log("- Order Amount (rupees):", Number(order.amount) / 100);
    // console.log("- Order Currency:", order.currency);
    // console.log("========================");

    return res.json({
      success: true,
      order,
      key: RAZORPAY_KEY_ID, // Use proper key ID variable
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode,
      error: error.error
    });
    
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
      details: {
        statusCode: error.statusCode,
        errorType: error.constructor.name
      }
    });
  }
});

// Verify payment endpoint
payment.post("/verify", async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "All payment verification fields are required",
      });
    }

    // Verify signature (mock verification for development)
    // In production, you would use:
    // const generated_signature = crypto
    //   .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    //   .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    //   .digest("hex");
    
    const isSignatureValid = true; // Mock validation

    if (isSignatureValid) {
      // Create bookings from cart items
      try {
        const bookingService = new BookingService();
        const cartService = new CartService();
        
        // console.log("Payment verified, creating bookings...");
        
        // For this implementation, we need to get the user ID from the order creation
        // In a real implementation, you'd get this from authenticated request
        // For now, we'll use a placeholder or get it from the order notes
        
        // Note: This is a simplified implementation since we don't have user authentication in this endpoint
        // In production, you'd:
        // 1. Get user ID from authenticated session
        // 2. Fetch user's cart items
        // 3. Create bookings for each cart item
        // 4. Clear the cart
        
        // Validate user ID
        if (!userId) {
          console.error("User ID not provided in payment verification");
          return res.status(400).json({
            success: false,
            message: "User ID is required for booking creation",
          });
        }
        
        // console.log(`=== PAYMENT VERIFICATION DEBUGGING ===`);
        // console.log(`Creating bookings for user: ${userId}`);
        
        // Get user's cart
        const userCart = await cartService.getCartByUserId(userId);
        
        if (userCart && userCart.items.length > 0) {
          console.log(`Found ${userCart.items.length} items in cart:`);
          userCart.items.forEach((item, index) => {
            console.log(`Item ${index + 1}:`);
            console.log(`  - Package ID: ${item.packageId}`);
            console.log(`  - Title: ${item.title}`);
            console.log(`  - Price: ₹${item.price}`);
            console.log(`  - Original Price: ₹${item.originalPrice}`);
          });
          
          const cartTotal = userCart.items.reduce((sum, item) => sum + item.price, 0);
          console.log(`Cart Total: ₹${cartTotal}`);
        } else {
          console.log("No cart items found");
        }
        
        if (userCart && userCart.items.length > 0) {
          console.log(`Found ${userCart.items.length} items in cart, creating bookings...`);
          
          // Create booking for each cart item
          const bookings = [];
          for (const cartItem of userCart.items) {
            try {
              // Skip items with invalid package ID format
              if (!cartItem.packageId || cartItem.packageId.length !== 24) {
                console.error(`Skipping item with invalid package ID format: ${cartItem.packageId}. Expected 24-character hex string.`);
                continue;
              }
              
              // Fetch package to get agentId and seat information
              const packageData = await PackageModel.findById(cartItem.packageId);
              
              if (!packageData) {
                console.error(`Package not found with ID: ${cartItem.packageId}`);
                continue;
              }
              
              if (!packageData.agentId) {
                console.error(`Package ${cartItem.packageId} has no agentId`);
                continue;
              }
              
              // Convert ObjectId to string for booking service
              const agentIdString = packageData.agentId.toString();
              
              // Create booking with agentId from package
              const booking = await bookingService.createBooking({
                userId: userId,
                packageId: cartItem.packageId,
                agentId: agentIdString,
                numberOfTravellers: 1,
                totalPrice: cartItem.price,
                startDate: new Date(cartItem.startDate || Date.now()),
                endDate: new Date(cartItem.endDate || Date.now() + 24 * 60 * 60 * 1000),
                specialRequests: `Booking for ${cartItem.title} - ${cartItem.duration}`
              });
              
              // Update booking status to "confirmed" after successful payment
              await bookingService.updateBookingStatus(booking._id.toString(), "confirmed");
              console.log(`Payment successful - Updated booking ${booking._id} status to "confirmed"`);
              
              // Update available seats in package (decrement by 1 for each booking)
              const newAvailableSeats = (packageData.availableSeats || 0) - 1;
              const newTotalSeats = (packageData.totalSeats || 0) - 1;
              
              await PackageModel.findByIdAndUpdate(cartItem.packageId, {
                availableSeats: newAvailableSeats,
                totalSeats: newTotalSeats
              });
              
              console.log(`Updated package ${cartItem.packageId} seats: available=${newAvailableSeats}, total=${newTotalSeats}`);
              
              bookings.push(booking);
              console.log(`Created and confirmed booking for package ${cartItem.packageId}:`, booking._id);
            } catch (itemError) {
              console.error(`Failed to create booking for package ${cartItem.packageId}:`, itemError);
            }
          }
          
          // Clear the cart after successful booking creation
          if (bookings.length > 0) {
            await cartService.clearCart(userId);
            console.log(`Cleared cart for user ${userId}`);
          }
          
          return res.json({
            success: true,
            message: `Payment verified and ${bookings.length} bookings confirmed successfully`,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            bookingsCreated: bookings.length
          });
        } else {
          console.log("No cart items found for user");
          return res.json({
            success: true,
            message: "Payment verified but no cart items found",
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            bookingsCreated: 0
          });
        }
      } catch (bookingError: any) {
        console.error("Error creating bookings:", bookingError);
        return res.status(500).json({
          success: false,
          message: "Payment verified but booking creation failed",
          error: bookingError.message,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});

// Get payment status
payment.get("/status/:orderId", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Mock payment status - in production, fetch from database
    const paymentStatus = {
      orderId,
      paymentId: `pay_${Date.now()}`,
      status: "paid",
      amount: 50000, // in paise
      currency: "INR",
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    };

    return res.json({
      success: true,
      data: paymentStatus,
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment status",
    });
  }
});

// Process refund
payment.post("/refund", async (req: Request, res: Response) => {
  try {
    const { paymentId, amount, reason } = req.body;

    // Validate required fields
    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required",
      });
    }

    // Mock refund processing
    const refund = {
      id: `refund_${Date.now()}`,
      entity: "refund",
      amount: amount || 50000, // in paise
      currency: "INR",
      payment_id: paymentId,
      notes: reason ? { reason } : {},
      created_at: Math.floor(Date.now() / 1000),
      status: "processed",
    };

    return res.json({
      success: true,
      message: "Refund processed successfully",
      data: refund,
    });
  } catch (error) {
    console.error("Error processing refund:", error);
    return res.status(500).json({
      success: false,
      message: "Refund processing failed",
    });
  }
});

// Get payment history
payment.get("/history", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    // Mock payment history - in production, fetch from database
    const paymentHistory = [
      {
        orderId: `order_${Date.now() - 86400000}`,
        paymentId: `pay_${Date.now() - 86400000}`,
        status: "paid",
        amount: 50000,
        currency: "INR",
        createdAt: Math.floor((Date.now() - 86400000) / 1000),
        updatedAt: Math.floor((Date.now() - 86400000) / 1000),
      },
      {
        orderId: `order_${Date.now() - 172800000}`,
        paymentId: `pay_${Date.now() - 172800000}`,
        status: "paid",
        amount: 75000,
        currency: "INR",
        createdAt: Math.floor((Date.now() - 172800000) / 1000),
        updatedAt: Math.floor((Date.now() - 172800000) / 1000),
      },
    ];

    return res.json({
      success: true,
      data: paymentHistory,
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
    });
  }
});

export default payment;
