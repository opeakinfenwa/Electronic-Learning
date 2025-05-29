import express from "express";
import {
  createLessonController,
  updateLessonController,
  deleteLessonController,
  getLessonsForStudentController,
  getLessonsForCourseController,
  getLessonByIdController,
} from "../controllers/lessonController";
import { isAuth, isInstructor, isStudent } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/:courseId", isAuth, isInstructor, createLessonController);
router.put("/:lessonId", isAuth, isInstructor, updateLessonController);
router.delete("/:lessonId", isAuth, isInstructor, deleteLessonController);
router.get(
  "/:courseId/students",
  isAuth,
  isStudent,
  getLessonsForStudentController
);
router.get("/:courseId", isAuth, isInstructor, getLessonsForCourseController);
router.get("/:lessonId", isAuth, getLessonByIdController);

export default router;