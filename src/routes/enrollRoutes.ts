import express from "express";
import {
  isAdmin,
  isAuth,
  isInstructor,
  isStudent,
} from "../middleware/authMiddleware";
import {
  enrollInCourseController,
  getUserEnrollmentsController,
  checkEnrollmentController,
  unenrollFromCourseController,
  getEnrollmentByIdController,
  getAllEnrollmentsController,
  getEnrollmentsByCourseController,
} from "../controllers/enrollmentController";

const router = express.Router();

router.post("/:courseId", isAuth, isStudent, enrollInCourseController);
router.get("/enrollments", isAuth, isStudent, getUserEnrollmentsController);
router.get(
  "/:courseId/is-enrolled",
  isAuth,
  isStudent,
  checkEnrollmentController
);
router.delete("/:courseId", isAuth, isStudent, unenrollFromCourseController);
router.get("/:enrollmentId", isAuth, getEnrollmentByIdController);
router.get("/", isAuth, isAdmin, getAllEnrollmentsController);
router.get(
  "/:courseId/course-enrollments",
  isAuth,
  isInstructor,
  getEnrollmentsByCourseController
);

export default router;