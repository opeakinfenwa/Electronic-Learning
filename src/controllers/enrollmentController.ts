import { Request, Response, NextFunction } from "express";
import {
  enrollInCourse,
  getUserEnrollments,
  isUserEnrolled,
  unenrollFromCourse,
  getAllEnrollments,
  getEnrollmentById,
  getEnrollmentsByCourseId,
} from "../services/enrollmentService";
import { enrollInCourseSchema } from "../validations/enrollValidation";
import { ZodError } from "zod";

export const enrollInCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    enrollInCourseSchema.parse({ courseId });

    const enrollment = await enrollInCourse(userId, courseId);
    res.status(200).json({
      message: "Enrollment successful",
      data: enrollment,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }
    next(error);
  }
};

export const getUserEnrollmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const enrollments = await getUserEnrollments(userId);
    res.status(200).json({
      message: "Enrollments fetched",
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

export const checkEnrollmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const isEnrolled = await isUserEnrolled(userId, courseId);
    res.status(200).json({
      message: "User is enrolled in this course",
      Data: isEnrolled,
    });
  } catch (error) {
    next(error);
  }
};

export const unenrollFromCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    await unenrollFromCourse(userId, courseId);
    res.status(200).json({
      message: "Unenrolled from course successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getEnrollmentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;

    const enrollment = await getEnrollmentById(id, requesterId, requesterRole);

    res.status(200).json({
      message: "Enrollment details fetched succesfully",
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEnrollmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requesterRole = req.user.role;
    const enrollments = await getAllEnrollments(requesterRole);
    res.status(200).json({
      message: " User enrollments successfully fetched",
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

export const getEnrollmentsByCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const courseId = req.params.courseId;
    const requesterId = req.user.id;

    const enrollments = await getEnrollmentsByCourseId(courseId, requesterId);
    res.status(200).json({
      message: "Enrollments fetched successfully",
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};