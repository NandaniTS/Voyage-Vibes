import z from "zod";
import { MongooseObjectIdSchema, TimeStampSchema } from "./common";
import { GetByIdQueryParamsSchema, GetQueryParamsSchema } from "./query-param";
import { UserTypeEnum } from "../enums";

export const UserSchema = z
  .object({
    _id: MongooseObjectIdSchema.optional(),
    fullName: z.string().optional(),
    email: z.string().toLowerCase().email().optional(),
    password: z.string().optional(),
    userType: z.nativeEnum(UserTypeEnum).optional(),
    phoneNumber: z.string().optional(),
    bankDetails: z.object({
      accountHolderName: z.string(),
      accountNumber: z.string(),
      bankName: z.string(),
      ifscCode: z.string(),
    }).optional(),
    isSuspended: z.boolean().optional(),
  })
  .extend(TimeStampSchema.shape);

export const CreateUserSchema = UserSchema.pick({
  fullName: true,
  email: true,
  password: true,
  userType: true,
  phoneNumber: true,
}).required({
  fullName: true,
  email: true,
  password: true,
  userType: true,
  phoneNumber: true,
});

export const UpdateUserSchema = UserSchema.pick({
  _id: true,
  fullName: true,
  password: true,
  bankDetails: true,
}).required({
  _id: true,
});

export const GetByIdUserSchema = z
  .object({
    _id: MongooseObjectIdSchema,
    query: GetByIdQueryParamsSchema.pick({
      fields: true,
    }).optional(),
  })
  .required({
    _id: true,
  });

export const GetAllUserSchema = z.array(
  z.object({
    query: GetQueryParamsSchema.pick({
      fields: true,
      page: true,
      limit: true,
      sort: true,
    }).optional(),
  })
);

export const LoginSchema = UserSchema.pick({
  email: true,
  password: true
})

export const CreateUserResponseSchema = UserSchema;

export const UpdateUserResponseSchema = UserSchema;

export const GetAllUserResponseSchema = z.object({
  data: z.array(UserSchema),
  totalItems: z.number(),
});

export const GetByIdUserResponseSchema = UserSchema;
