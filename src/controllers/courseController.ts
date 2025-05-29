import { Request, Response, NextFunction } from "express";
import {
  createCourse,
  getAllCourses,
  getUserCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../services/courseService";
import { prisma } from "../config/db";
import { courseSchema } from "../validations/courseValidation";
import { ZodError } from "zod";

export const createCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description } = courseSchema.parse(req.body);
    const userId = req.user.id;

    const course = await createCourse(title, description, userId);
    res.status(201).json({
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    next(error);
  }
};

export const getAllCoursesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const courses = await getAllCourses();
    res.status(200).json({
      message: "All courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserCoursesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const courses = await getUserCourses(userId);
    res.status(200).json({
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    const course = await getCourseById(courseId);

    if (!course) {
      res.status(404).json({
        message: "Course not found",
      });
    }

    const safeCourse = course as NonNullable<typeof course>;

    if (safeCourse.userId !== userId && req.user.role !== "admin") {
      res.status(403).json({
        message: "Not authorized to view this course",
      });
    }

    res.status(200).json({
      message: "Course details fetched successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    const updates = courseSchema.partial().parse(req.body);

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      res.status(404).json({
        message: "Course not found",
      });
    }

    const safeCourse = course as NonNullable<typeof course>;

    if (safeCourse.userId !== userId && req.user.role !== "admin") {
      res.status(403).json({
        message: "Not authorized to update this course",
      });
    }

    const updated = await updateCourse(courseId, updates);
    res.status(201).json({
      message: "Course updated successfully",
      data: updated,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    next(error);
  }
};

export const deleteCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      res.status(404).json({
        message: "Course not found",
      });
    }
    const safeCourse = course as NonNullable<typeof course>;

    if (safeCourse.userId !== userId && req.user.role !== "admin") {
      res.status(403).json({
        message: "Not authorized to delete this course",
      });
    }

    await deleteCourse(courseId);

    res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};