import z from "zod";
import { CreateUserResponseSchema, CreateUserSchema, GetAllUserResponseSchema, GetAllUserSchema, GetByIdUserResponseSchema, GetByIdUserSchema, LoginSchema, UpdateUserResponseSchema, UpdateUserSchema, UserSchema } from "../schemas";

export type TUser = z.infer<typeof UserSchema>;

//REQUEST TYPES

export type TLogInRequest = z.infer<typeof LoginSchema>

export type TCreateUserRequest = z.infer<typeof CreateUserSchema>;

export type TUpdateUserRequest = z.infer<typeof UpdateUserSchema>;

export type TGetByIdUserRequest = z.infer<typeof GetByIdUserSchema>;

export type TGetAllUserRequest = z.infer<typeof GetAllUserSchema>;


//RESPONSE TYPES

export type TLogInResponse = z.infer<typeof UserSchema>

export type TCreateUserResponse = z.infer<typeof CreateUserResponseSchema>;

export type TUpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;

export type TGetByIdUserResponse = z.infer<typeof GetByIdUserResponseSchema>;

export type TGetAllUserResponse = z.infer<typeof GetAllUserResponseSchema>;