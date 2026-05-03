import { z } from "zod";
import { DateZodSchema } from "./common";

export const RECORD_LIMIT = 20;

export enum SortOrderEnum {
  ASC = "asc",
  ASCENDING = "ascending",
  DESC = "desc",
  DESCENDING = "descending",
}

export const QuerySortSchema = z.object({
  sortKey: z.coerce.string(),
  sortOrder: z.nativeEnum(SortOrderEnum),
});

const DateRangeFilterSchema = z.object({
  filterKey: z.string(),
  range: z.object({
    gte: DateZodSchema.optional(),
    lte: DateZodSchema.optional(),
    gt: DateZodSchema.optional(),
    lt: DateZodSchema.optional(),
  }),
});

export const PopulateFieldsSchema = z.object({
  path: z.coerce.string(),
  select: z.array(z.coerce.string()).optional(),
  populate: z
    .array(
      z.object({
        path: z.coerce.string(),
        select: z.array(z.coerce.string()).optional(),
      }),
    )
    .optional(),
});

export const GetQueryParamsSchema = z.object({
   populate: z.array(PopulateFieldsSchema).optional(),
  filters: z.record(z.string(), z.any()).optional(),
  search: z.coerce.string().optional(),
  sort: QuerySortSchema.optional(),
  page: z.coerce.number().positive().default(1).optional(),
  limit: z.coerce.number().positive().default(RECORD_LIMIT).optional(),
  fields: z.array(z.string()).optional(),
  dateRange: z.array(DateRangeFilterSchema).optional(),
});


export const GetByIdQueryParamsSchema = z.object({
   populate: z.array(PopulateFieldsSchema).optional(),
  fields: z.array(z.string()).optional(),
});

