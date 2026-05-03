import z from "zod";
import { WishlistStatusEnum } from "../enums";
import { MongooseObjectIdSchema, TimeStampSchema } from "./common";
import { GetByIdQueryParamsSchema, GetQueryParamsSchema } from "./query-param";
import { PackageSchema } from "./package";

export const WishlistSchema = z.object({
  _id: MongooseObjectIdSchema.optional(),
  userId: MongooseObjectIdSchema.optional(),
  packageId: MongooseObjectIdSchema.optional(),
  status: z.nativeEnum(WishlistStatusEnum).optional(),
}).extend(TimeStampSchema.shape);

export const CreateWishlistSchema = WishlistSchema.pick({
  userId: true,
  packageId: true,
  status: true,
}).required({
  userId: true,
  packageId: true,
});

export const UpdateWishlistSchema = WishlistSchema.pick({
  _id: true,
  status: true,
  userId: true,
}).required({
  _id: true,
  status: true,
});

export const GetByIdWishlistSchema = z
  .object({
    _id: MongooseObjectIdSchema,
    query: GetByIdQueryParamsSchema.pick({
      fields: true,
    }).optional(),
  })
  .required({
    _id: true,
  });

export const GetAllWishlistSchema = z.object({
  query: GetQueryParamsSchema.pick({
    fields: true,
    page: true,
    limit: true,
    sort: true,
    filters: true,
    populate:true
  })
    .extend({
      filters: WishlistSchema.partial().extend({
        userId: MongooseObjectIdSchema.optional(),
      }),
    })
    .optional(),
});

export const CreateWishlistResponseSchema = WishlistSchema;

export const UpdateWishlistResponseSchema = WishlistSchema;

export const GetAllWishlistResponseSchema = z.object({
  data: z.array(WishlistSchema.extend({
  package: PackageSchema.optional(),
})),
  totalItems: z.number(),
});

export const GetByIdWishlistResponseSchema = WishlistSchema.extend({
  package: PackageSchema.optional(),
});
