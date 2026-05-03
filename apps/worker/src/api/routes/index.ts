import { Router } from "express";
import authRouter from "./auth.routes";
import packageRouter from "./package.routes";
import bookingRouter from "./booking.routes";
import reviewRouter from "./review.routes";
import wishlistRouter from "./wishlist.routes";
import paymentRouter from "./payment.routes";
import cartRouter from "./cart.routes";
import uploadRouter from "./upload.routes";
import earningsRouter from "./earnings.routes";
import analyticsRouter from "./analytics.routes";
import adminRouter from "./admin.routes";

const router: Router = Router();

router.use("/auth", authRouter);
router.use("/packages", packageRouter);
router.use("/bookings", bookingRouter);
router.use("/reviews", reviewRouter);
router.use("/wishlist", wishlistRouter);
router.use("/payment", paymentRouter);
router.use("/carts", cartRouter);
router.use("/upload", uploadRouter);
router.use("/earnings", earningsRouter);
router.use("/analytics", analyticsRouter);
router.use("/admin", adminRouter);

export default router;