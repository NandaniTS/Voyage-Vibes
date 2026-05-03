import z from "zod";
import { AvailableDatesSchema, CreatePackageSchema, GetAllPackageResponseSchema, GetAllPackageSchema, GetByIdPackageResponseSchema, GetByIdPackageSchema, ItinerarySchema, PackageSchema, UpdatePackageSchema } from "../schemas";

export type TPackage = z.infer<typeof PackageSchema>;

export type TItinerary = z.infer<typeof ItinerarySchema>;

export type TAvailableDate = z.infer<typeof AvailableDatesSchema>;


//REQUEST

export type TCreatePackageRequest = z.infer<typeof CreatePackageSchema>;

export type TUpdatePackageRequest = z.infer<typeof UpdatePackageSchema>;

export type TGetByIdPackageRequest = z.infer<typeof GetByIdPackageSchema>;

export type TGetAllPackageRequest = z.infer<typeof GetAllPackageSchema>;

//RESPONSE

export type TCreatePackageResponse = z.infer<typeof CreatePackageSchema>;

export type TUpdatePackageResponse = z.infer<typeof UpdatePackageSchema>;

export type TGetByIdPackageResponse = z.infer<typeof GetByIdPackageResponseSchema>;

export type TGetAllPackageResponse = z.infer<typeof GetAllPackageResponseSchema>;