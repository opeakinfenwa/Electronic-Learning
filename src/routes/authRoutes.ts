import { Router } from "express";
import {
  changePasswordController,
  loginController,
  logoutController,
  resetPasswordController,
} from "../controllers/authController";
import { isAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/login", loginController);
router.post("/logout", isAuth, logoutController);
router.put("/password-rest", isAuth, resetPasswordController);
router.put("/change-password", isAuth, changePasswordController);

export default router;