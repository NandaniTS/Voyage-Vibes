import { BaseService } from "./base-service";
import { IUserDocument, UserModel } from "../models/user-model";
import crypto from "crypto";

// TODO: Install dependencies: pnpm add bcrypt jsonwebtoken
// TODO: Install dev dependencies: pnpm add -D @types/bcrypt @types/jsonwebtoken

export class AuthService extends BaseService<IUserDocument> {
  constructor() {
    super(UserModel);
  }

  private hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
  }

  private generateToken(userId: string, email: string): string {
    const payload = JSON.stringify({ userId, email, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
    return Buffer.from(payload).toString("base64");
  }

  async signup(data: {
    fullName: string;
    email: string;
    password: string;
    userType: string;
    phoneNumber: string;
  }) {
    const existingUser = await this.model.findOne({ email: data.email });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const hashedPassword = this.hashPassword(data.password);

    const user = await this.model.create({
      ...data,
      password: hashedPassword,
    });

    const token = this.generateToken(user._id.toString(), user.email || "");

    return {
      user: this.filterRecordAccessibleFields(user.toObject(), [
        "_id",
        "fullName",
        "email",
        "userType",
        "phoneNumber",
        "createdAt",
        "updatedAt",
      ]),
      token,
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.model.findOne({ email: data.email });
    // console.log(user)
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const hashedPassword = this.hashPassword(data.password);
    if (hashedPassword !== user.password) {
      throw new Error("Invalid email or password");
    }

    const token = this.generateToken(user._id.toString(), user.email || "");

    return {
      user: this.filterRecordAccessibleFields(user.toObject(), [
        "_id",
        "fullName",
        "email",
        "userType",
        "createdAt",
        "updatedAt",
      ]),
      token,
    };
  }

  
}


