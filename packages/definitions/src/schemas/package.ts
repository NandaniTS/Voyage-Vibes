import z from "zod";
import {
  DateZodSchema,
  MongooseObjectIdSchema,
  TimeStampSchema,
} from "./common";
import { GetByIdQueryParamsSchema, GetQueryParamsSchema } from "./query-param";

export const ItinerarySchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  activities: z.array(z.string()).optional(),
});

export const AvailableDatesSchema = z.object({
  startDate: DateZodSchema.optional(),
  endDate: DateZodSchema.optional(),
  seatsAvailable: z.number().optional(),
});

export const PackageSchema = z
  .object({
    _id: MongooseObjectIdSchema.optional(),
    title: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    itinerary: z.array(ItinerarySchema).optional(),
    price: z.number().optional(),
    disountPrice: z.number().optional(),
    currency: z.string().optional(),
    startLocation: z.string().optional(),
    endLocation: z.string().optional(),
    destinations: z.array(z.string()).optional(),
    category: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    noOfDays: z.number().optional(),
    noOfNights: z.number().optional(),
    duration: z.array(
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
      })
    ).optional(),
    minAge: z.number().optional(),
    availableDates: z.array(AvailableDatesSchema).optional(),
    isActive: z.boolean().optional(),
    agentId: MongooseObjectIdSchema.optional(),
    totalSeats: z.number().optional(),
    availableSeats: z.number().optional()
  })
  .extend(TimeStampSchema.shape);

export const CreatePackageSchema = PackageSchema.pick({
  title: true,
  slug: true,
  description: true,
  itinerary: true,
  price: true,
  disountPrice: true,
  currency: true,
  startLocation: true,
  endLocation: true,
  destinations: true,
  category: true,
  images: true,
  noOfDays: true,
  noOfNights: true,
  minAge: true,
  availableDates: true,
  isActive: true,
  agentId:true,
  totalSeats: true,
  availableSeats: true
}).required({
  title: true,
  itinerary: true,
  price: true,
  currency: true,
  startLocation: true,
  endLocation: true,
  destinations: true,
  category: true,
  images: true,
  noOfDays: true,
  noOfNights: true,
  minAge: true,
  availableDates: true,
  isActive: true,
  agentId:true,
  totalSeats: true,
  availableSeats: true
});

export const UpdatePackageSchema = PackageSchema.pick({
  _id: true,
  title: true,
  slug: true,
  description: true,
  itinerary: true,
  price: true,
  disountPrice: true,
  currency: true,
  startLocation: true,
  endLocation: true,
  destinations: true,
  category: true,
  images: true,
  noOfDays: true,
  noOfNights: true,
  duration: true,
  minAge: true,
  availableDates: true,
  isActive: true,
}).required({
  _id: true,
});

export const GetByIdPackageSchema = z
  .object({
    _id: MongooseObjectIdSchema,
    query: GetByIdQueryParamsSchema.pick({
      fields: true,
    }).optional(),
  })
  .required({
    _id: true,
  });

export const GetAllPackageSchema = z.object({
    query: GetQueryParamsSchema.pick({
      search: true,
      fields: true,
      page: true,
      limit: true,
      sort: true,
      filters:true
    }).optional(),
  })


export const CreatePackageResponseSchema = PackageSchema;

export const UpdatePackageResponseSchema = PackageSchema;

export const GetAllPackageResponseSchema = z.object({
  data: z.array(PackageSchema),
  totalItems: z.number(),
});

export const GetByIdPackageResponseSchema = PackageSchema;