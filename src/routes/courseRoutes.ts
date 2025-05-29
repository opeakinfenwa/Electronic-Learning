import { Router } from "express";
import {
  createCourseController,
  getAllCoursesController,
  getCourseByIdController,
  getUserCoursesController,
  updateCourseController,
  deleteCourseController,
} from "../controllers/courseController";
import {
  isAuth,
  isAdmin,
  isInstructor,
  isInstructorOrAdmin,
} from "../middleware/authMiddleware";

const router = Router();

router.post("/create-course", isAuth, isInstructor, createCourseController);
router.put("/update-course/:courseid", isAuth, isInstructorOrAdmin, updateCourseController);
router.delete("/delete-course/:courseid", isAuth, isInstructorOrAdmin, deleteCourseController);
router.get("/", isAdmin, getAllCoursesController);
router.get("/:id", isAuth, isInstructorOrAdmin, getCourseByIdController);
router.get("/get-courses", isAuth, isInstructor, getUserCoursesController);

export default router;