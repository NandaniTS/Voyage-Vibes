import z from "zod";
import {
    MongooseObjectIdSchema,
    TimeStampSchema,
} from "./common";
import { GetByIdQueryParamsSchema, GetQueryParamsSchema } from "./query-param";
import { ReviewStatusEnum } from "../enums";
import { PackageSchema } from "./package";
import { UserSchema } from "./user";


export const ReviewSchema = z.object({
    _id:MongooseObjectIdSchema.optional(),
    userId: MongooseObjectIdSchema.optional(),
    packageId: MongooseObjectIdSchema.optional(),
    bookingId: MongooseObjectIdSchema.optional(),
    rating: z.number().optional(),
    comment: z.string().optional(),
    status: z.nativeEnum(ReviewStatusEnum).optional()
}).extend(TimeStampSchema.shape)

export const CreateReviewSchema = ReviewSchema.pick({
    userId:true,
    packageId:true,
    bookingId:true,
    rating:true,
    comment:true,
    status:true
}).required({
    userId:true,
    packageId:true,
    bookingId:true,
    rating:true,
    status:true
})

export const UpdateReviewSchema = ReviewSchema.pick({
    _id:true,
    rating:true,
    comment:true,
    status:true
}).required({
    _id:true
})


export const GetByIdReviewSchema = z
    .object({
        _id: MongooseObjectIdSchema,
        query: GetByIdQueryParamsSchema.pick({
            fields: true,
            populate:true
        }).optional(),
    })
    .required({
        _id: true,
    });

export const GetAllReviewSchema = z.object({
    query: GetQueryParamsSchema.pick({
        fields: true,
        page: true,
        limit: true,
        sort: true,
        filters: true,
        populate:true
    }).extend({
        filters: ReviewSchema.partial()
            .extend({
                userId: MongooseObjectIdSchema.optional(),
                packageId: MongooseObjectIdSchema.optional(),
                agentId: MongooseObjectIdSchema.optional()
            })
    }).optional(),
})


export const CreateReviewResponseSchema = ReviewSchema;

export const UpdateReviewResponseSchema = ReviewSchema;

export const GetAllReviewsResponseSchema = z.object({
    data:  z.array(ReviewSchema.extend({
      package: PackageSchema.optional(),
      user: UserSchema.optional()
    })),
    totalItems: z.number(),
});

export const GetByIdReviewResponseSchema = ReviewSchema;