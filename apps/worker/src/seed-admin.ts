import "dotenv/config";
import mongoose from "mongoose";
import crypto from "crypto";
import { UserModel } from "./models/user-model";

const DATABASE_URI = process.env.DATABASE_URI || "";

const ADMIN = {
  fullName: "Super Admin",
  email: "admin@traveljunction.com",
  password: "Admin@1234",
  userType: "admin",
  phoneNumber: "+910000000000",
};

async function seed() {
  await mongoose.connect(DATABASE_URI);
  console.log("DB connected");

  const existing = await UserModel.findOne({ email: ADMIN.email });
  if (existing) {
    console.log("Admin already exists:", ADMIN.email);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(ADMIN.password)
    .digest("hex");

  await UserModel.create({ ...ADMIN, password: hashedPassword });

  console.log("✅ Admin seeded successfully");
  console.log("   Email   :", ADMIN.email);
  console.log("   Password:", ADMIN.password);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
