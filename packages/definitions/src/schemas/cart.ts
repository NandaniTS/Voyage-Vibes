import z from "zod";
import {
  MongooseObjectIdSchema,
  TimeStampSchema,
} from "./common";
import { GetByIdQueryParamsSchema, GetQueryParamsSchema } from "./query-param";

export const CartItemSchema = z.object({
  packageId: MongooseObjectIdSchema,
  title: z.string(),
  price: z.number(),
  originalPrice: z.number(),
  image: z.string().url(),
  duration: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  seatsAvailable: z.number(),
  category: z.string(),
  startLocation: z.string(),
  endLocation: z.string(),
});

export const CartSchema = z.object({
  _id: MongooseObjectIdSchema.optional(),
  userId: MongooseObjectIdSchema,
  items: z.array(CartItemSchema),
  isActive: z.boolean().default(true),
}).extend(TimeStampSchema.shape);

export const CreateCartSchema = CartSchema.pick({
  userId: true,
  items: true,
}).required({
  userId: true,
  items: true,
});

export const UpdateCartSchema = CartSchema.pick({
  _id: true,
  items: true,
  isActive: true,
}).required({
  _id: true,
});

export const AddToCartSchema = z.object({
  userId: MongooseObjectIdSchema,
  item: CartItemSchema,
}).required({
  userId: true,
  item: true,
});

export const RemoveFromCartSchema = z.object({
  userId: MongooseObjectIdSchema,
  packageId: MongooseObjectIdSchema,
}).required({
  userId: true,
  packageId: true,
});

export const GetByIdCartSchema = z
  .object({
    _id: MongooseObjectIdSchema,
    query: GetByIdQueryParamsSchema.pick({
      fields: true,
    }).optional(),
  })
  .required({
    _id: true,
  });

export const GetUserCartSchema = z
  .object({
    userId: MongooseObjectIdSchema,
    query: GetQueryParamsSchema.pick({
      fields: true,
    }).optional(),
  })
  .required({
    userId: true,
  });

export const GetAllCartSchema = z.object({
  query: GetQueryParamsSchema.pick({
    fields: true,
    page: true,
    limit: true,
    sort: true,
    filters: true,
  })
    .extend({
      filters: CartSchema.partial()
        .extend({
          userId: MongooseObjectIdSchema.optional(),
        })
    })
    .optional(),
});

export const CreateCartResponseSchema = CartSchema;
export const UpdateCartResponseSchema = CartSchema;
export const GetAllCartResponseSchema = z.object({
  data: z.array(CartSchema),
  totalItems: z.number(),
});
export const GetByIdCartResponseSchema = CartSchema;
export const GetUserCartResponseSchema = CartSchema;
