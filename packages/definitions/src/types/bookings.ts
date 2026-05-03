import z from "zod";
import { BookingSchema, CreateBookingResponseSchema, CreateBookingSchema, GetAllBookingsResponseSchema, GetAllBookingsSchema, GetByIdBookingResponseSchema, GetByIdBookingSchema, UpdateBookingResponseSchema, UpdateBookingSchema } from "../schemas";

export type TBooking = z.infer<typeof BookingSchema>;

//REQUEST

export type TCreateBookingRequest = z.infer<typeof CreateBookingSchema>;

export type TUpdateBookingRequest = z.infer<typeof UpdateBookingSchema>;

export type TGetByIdBookingRequest = z.infer<typeof GetByIdBookingSchema>;

export type TGetAllBookingRequest = z.infer<typeof GetAllBookingsSchema>;

//RESPONSE

export type TCreateBookingResponse = z.infer<typeof CreateBookingResponseSchema>;

export type TUpdateBookingResponse = z.infer<typeof UpdateBookingResponseSchema>;

export type TGetByIdBookingResponse = z.infer<typeof GetByIdBookingResponseSchema>;

export type TGetAllBookingResponse = z.infer<typeof GetAllBookingsResponseSchema>;