import { Router, Request, Response } from "express";
import { AuthService } from "../../services/auth-service";
import { UserModel } from "../../models/user-model";
import crypto from "crypto";

const router = Router();
const authService = new AuthService();

function getUserIdFromToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.slice(7);
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
    return payload.userId ?? null;
  } catch {
    return null;
  }
}



router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, userType, phoneNumber } = req.body;

    if (!fullName || !email || !password || !userType || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const result = await authService.signup({
      fullName,
      email,
      password,
      userType,
      phoneNumber,
    });

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Signup failed",
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

  
    const result = await authService.login({ email, password });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {

    return res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
});

router.post("/change-password", async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new password are required" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const hashedCurrent = crypto.createHash("sha256").update(currentPassword).digest("hex");
    if (hashedCurrent !== user.password) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = crypto.createHash("sha256").update(newPassword).digest("hex");
    await user.save();

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to change password",
    });
  }
});

export default router;
