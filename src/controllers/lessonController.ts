import { Request, Response, NextFunction } from "express";
import {
  createLesson,
  getLessonsForCourse,
  getLessonsForStudent,
  updateLesson,
  deleteLesson,
  getLessonById,
} from "../services/lessonService";
import { prisma } from "../config/db";
import { lessonSchema } from "../validations/lessonValidation";
import { ZodError } from "zod";

export const createLessonController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    const { title, content } = lessonSchema.parse(req.body);

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to add lessons to this course." });
    }

    const lesson = await createLesson(courseId, title, content);
    res.status(201).json({
      message: "Lesson successfully created",
      data: lesson,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

export const updateLessonController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { lessonId } = req.params;
    const { title, content } = req.body;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });
    if (!lesson || lesson.course.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this lesson." });
    }

    const updatedLesson = await updateLesson(lessonId, { title, content });
    res.status(200).json({
      message: " Lesson updated successfully",
      data: updatedLesson,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLessonController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { lessonId } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });
    if (!lesson || lesson.course.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this lesson." });
    }

    await deleteLesson(lessonId);
    res.status(204).send({
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getLessonsForStudentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const lessons = await getLessonsForStudent(userId, courseId);
    res.status(200).json({
      message: "Lessons fetched successfully",
      data: lessons,
    });
  } catch (error) {
    next(error);
  }
};

export const getLessonsForCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.courseId;
    const requesterId = req.user.id;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { userId: true },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.userId !== requesterId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const lessons = await getLessonsForCourse(courseId);

    res.status(200).json({
      message: "Lessons successfully fetched",
      data: lessons,
    });
  } catch (error) {
    next(error);
  }
};

export const getLessonByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lessonId = req.params.id;
    const requesterId = req.user.id;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { courseId: true },
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const course = await prisma.course.findUnique({
      where: { id: lesson.courseId },
      select: { userId: true },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.userId !== requesterId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const fullLesson = await getLessonById(lessonId);

    res.status(200).json({
      message: "Lesson details successfully fetched",
      data: fullLesson,
    });
  } catch (error) {
    next(error);
  }
};