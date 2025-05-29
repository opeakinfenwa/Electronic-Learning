import { Router } from "express";
import {
  deleteUserController,
  signupController,
  updateUserController,
} from "../controllers/userController";
import { isAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/signup", signupController);
router.put("/update", isAuth, updateUserController);
router.delete("/:userId", isAuth, deleteUserController);

export default router;