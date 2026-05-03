import z from "zod";
import {
    DateZodSchema,
    MongooseObjectIdSchema,
    TimeStampSchema,
} from "./common";
import { GetByIdQueryParamsSchema, GetQueryParamsSchema } from "./query-param";
import { BookingStatusEnum } from "../enums";
import { PackageSchema } from "./package";
import { UserSchema } from "./user";


export const BookingSchema = z.object({
    _id: MongooseObjectIdSchema.optional(),
    userId: MongooseObjectIdSchema.optional(),
    packageId: MongooseObjectIdSchema.optional(),
    agentId: MongooseObjectIdSchema.optional(),
    noOfTravellers: z.number().optional(),
    startDate: DateZodSchema.optional(),
    endDate: DateZodSchema.optional(),
    totalPrice: z.number().optional(),
    specialRequests: z.string().optional(),
    status: z.nativeEnum(BookingStatusEnum).optional(),
    bookingDate: DateZodSchema.optional()
}).extend(TimeStampSchema.shape)


export const CreateBookingSchema = BookingSchema.pick({
    userId: true,
    packageId: true,
    agentId: true,
    noOfTravellers: true,
    startDate: true,
    endDate: true,
    totalPrice: true,
    specialRequests: true,
    status: true,
    bookingDate: true
}).required({
    userId: true,
    packageId: true,
    agentId: true,
    noOfTravellers: true,
    startDate: true,
    endDate: true,
    totalPrice: true,
})

export const UpdateBookingSchema = BookingSchema.pick({
    _id: true,
    status: true,
    bookingDate: true,
}).required({
    _id: true
})


export const GetByIdBookingSchema = z
    .object({
        _id: MongooseObjectIdSchema,
        query: GetByIdQueryParamsSchema.pick({
            fields: true,
            populate: true
        }).optional(),
    })
    .required({
        _id: true,
    });

export const GetAllBookingsSchema = z.object({
    query: GetQueryParamsSchema.pick({
        fields: true,
        page: true,
        limit: true,
        sort: true,
        filters: true,
        populate: true
    }).extend({
        filters: BookingSchema.partial()
            .extend({
                userId: MongooseObjectIdSchema.optional(),
                agentId: MongooseObjectIdSchema.optional(),
                packageId: MongooseObjectIdSchema.optional(),
            })
    }).optional(),
})

export const CreateBookingResponseSchema = BookingSchema;

export const UpdateBookingResponseSchema = BookingSchema;

export const GetAllBookingsResponseSchema = z.object({
    data: z.array(BookingSchema.extend({
        package: PackageSchema.optional(),
        user: UserSchema.optional(),
        agent: UserSchema.optional(),
    })),
    totalItems: z.number(),
});

export const GetByIdBookingResponseSchema = BookingSchema;