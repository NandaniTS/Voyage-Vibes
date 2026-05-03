import z from "zod";
import { ObjectIdRegex } from "../utils/regex-exp";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(timezone);
dayjs.extend(utc);

export const TimeStampSchema = z.object({
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const MongooseObjectIdSchema = z
  .string()
  .refine((value) => ObjectIdRegex.test(value), {
    message: "Invalid ObjectId format",
  });


export const DateZodSchema = z
  .string()
  .refine((data) => !!data && data.length > 0, { message: "Date is required" })
  .transform((val) => val.replace(/ /g, "+")) // fix '+' replaced by space
  .refine((val) => {
    return (
      dayjs(val).isValid(),
      {
        message: "Invalid date format",
      }
    );
  })
  .transform((val) => dayjs(val).utc().toISOString()); // Converts to UTC ISO string
