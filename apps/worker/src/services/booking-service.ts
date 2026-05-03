import { Types } from "mongoose";
import { BaseService } from "./base-service";
import { IBookingDocument, BookingModel } from "../models/booking-model";

export class BookingService extends BaseService<IBookingDocument> {
  constructor() {
    super(BookingModel);
  }

  async createBooking(data: {
    userId: string;
    packageId: string;
    agentId: string;
    numberOfTravellers: number;
    totalPrice: number;
    startDate: Date;
    endDate: Date;
    specialRequests?: string;
  }) {
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(data.userId)) {
      throw new Error(`Invalid userId format: ${data.userId}`);
    }

    if (!Types.ObjectId.isValid(data.packageId)) {
      throw new Error(`Invalid packageId format: ${data.packageId}`);
    }

    if (!Types.ObjectId.isValid(data.agentId)) {
      throw new Error(`Invalid agentId format: ${data.agentId}`);
    }

    // Prevent duplicate booking: same user + same package
    const existing = await this.model.findOne({
      userId: new Types.ObjectId(data.userId),
      packageId: new Types.ObjectId(data.packageId),
      status: { $in: ["pending", "confirmed", "completed"] },
    });

    if (existing) {
      throw new Error("You have already booked this package.");
    }

    const booking = await this.model.create({
      ...data,
      userId: new Types.ObjectId(data.userId),
      packageId: new Types.ObjectId(data.packageId),
      agentId: new Types.ObjectId(data.agentId),
      status: "pending",
      bookingDate: new Date(),
    });

    return booking;
  }

  async getBookingsByUser(userId: string) {
    const bookings = await this.model
      .find({ userId: new Types.ObjectId(userId) })
      .populate({ path: "packageId" })
      .populate({ path: "agentId", select: "fullName email" })
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 })
      .lean();

    const totalItems = await this.model.countDocuments({
      userId: new Types.ObjectId(userId),
    });

    const data = bookings.map(({ packageId, agentId, ...rest }) => ({
      ...rest,
      package: packageId,
      agent: agentId,
    }));

    return { data, totalItems };
  }

  async getBookingsByAgent(agentId: string) {
    const bookings = await this.model
      .find({ agentId: new Types.ObjectId(agentId) })
      .populate({ path: "packageId" })
      .populate({ path: "agentId", select: "fullName email" })
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 })
      .lean();

    const totalItems = await this.model.countDocuments({
      agentId: new Types.ObjectId(agentId),
    });

    const data = bookings.map(({ packageId, agentId, ...rest }) => ({
      ...rest,
      package: packageId,
      agent: agentId,
    }));

    return { data, totalItems };
  }

  async updateBooking(bookingId: string, updateData: any) {
    const booking = await this.model.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    );

    if (!booking) {
      throw new Error("Booking not found");
    }

    return booking;
  }

  async updateBookingStatus(bookingId: string, status: string) {
    const booking = await this.model.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!booking) {
      throw new Error("Booking not found");
    }

    return booking;
  }

  async hasUserBookedPackage(userId: string, packageId: string): Promise<boolean> {
    const existing = await this.model.findOne({
      userId: new Types.ObjectId(userId),
      packageId: new Types.ObjectId(packageId),
      status: { $in: ["pending", "confirmed", "completed"] },
    });
    return !!existing;
  }

  async getBookingById(bookingId: string) {
    const booking = await this.model
      .findById(bookingId)
      .populate("packageId")
      .populate("userId", "fullName email")
      .populate("agentId", "fullName email");

    if (!booking) {
      throw new Error("Booking not found");
    }

    return booking;
  }
}
