import { Router, Request, Response } from "express";
import { BookingService } from "../../services/booking-service";

const router = Router();
const bookingService = new BookingService();

// Check if user already booked a package
router.get("/check/:userId/:packageId", async (req: Request, res: Response) => {
  try {
    const { userId, packageId } = req.params;
    const alreadyBooked = await bookingService.hasUserBookedPackage(userId as string , packageId as string);
    return res.status(200).json({ success: true, data: { alreadyBooked } });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to check booking",
    });
  }
});

// Create booking
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, packageId, agentId, numberOfTravellers, totalPrice, startDate, endDate, specialRequests } = req.body;

    if (!userId || !packageId || !agentId || !totalPrice || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const booking = await bookingService.createBooking({
      userId,
      packageId,
      agentId,
      numberOfTravellers: 1,
      totalPrice,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      specialRequests,
    });

    return res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create booking",
    });
  }
});

// Get bookings by user
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bookings = await bookingService.getBookingsByUser(userId as string );
    const totalItems = bookings.totalItems;
    return res.status(200).json({
      success: true,
      data: {
        data: bookings.data,
        totalItems
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch bookings",
    });
  }
});


// Get bookings by agent
router.get("/agent/:agentId", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const bookings = await bookingService.getBookingsByAgent(agentId as string );
    const totalItems = bookings.totalItems;
    return res.status(200).json({
      success: true,
      data: {
        data: bookings.data,
        totalItems
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch bookings",
    });
  }
});


// Get booking by ID
router.get("/:bookingId", async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const booking = await bookingService.getBookingById(bookingId as string);

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Booking not found",
    });
  }
});


// Update booking (general update)
router.put("/:bookingId", async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const updateData = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const booking = await bookingService.updateBooking(bookingId as string, updateData);

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update booking",
    });
  }
});

// Update booking status
router.patch("/:bookingId/status", async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const booking = await bookingService.updateBookingStatus(bookingId as string, status);

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update booking",
    });
  }
});

export default router;
