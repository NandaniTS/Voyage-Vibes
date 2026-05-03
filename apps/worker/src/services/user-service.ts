import {
  TCreateUserRequest,
  TCreateUserResponse,
  TGetAllUserResponse,
  TGetByIdUserRequest,
  TGetByIdUserResponse,
  TUpdateUserRequest,
  TUpdateUserResponse,
} from "@repo/definitions";
import { IUserDocument, UserModel } from "../models";
import { BaseService } from "./base-service";

class UserService extends BaseService<IUserDocument> {
  constructor() {
    super(UserModel);
  }

  async create(data: TCreateUserRequest): Promise<TCreateUserResponse> {
    try {
      const existingUser = await this.model.findOne({ email: data.email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      return await this.model.create(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(data: TUpdateUserRequest): Promise<TUpdateUserResponse> {
    try {
      const require_doc = await this.model.findById(data._id);
      if (!require_doc) {
        throw new Error("User not found");
      }

      const updatedDoc = await this.model.findByIdAndUpdate(data._id, data, {
        new: true,
      });

      if (updatedDoc) {
        return updatedDoc;
      } else {
        throw new Error("Error while updating user");
      }
    } catch (error) {
      throw error;
    }
  }

  async getById(data: TGetByIdUserRequest): Promise<TGetByIdUserResponse> {
    try {
      const user = await this.model.findById(data._id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<TGetAllUserResponse> {
    try {
      const results = await this.model.find();

      const totalItems = await this.model.countDocuments();

      return {
        data: results,
        totalItems,
      };
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService();
export default UserService;
