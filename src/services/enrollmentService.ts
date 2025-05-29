import { prisma } from "../config/db";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../errors/customErrors";

export const enrollInCourse = async (userId: string, courseId: string) => {
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (existingEnrollment) {
    throw new ConflictError("User is already enrolled in this course.");
  }

  return await prisma.enrollment.create({
    data: {
      userId,
      courseId,
    },
  });
};

export const getUserEnrollments = async (userId: string) => {
  return await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: { id: true, title: true, description: true },
      },
    },
  });
};

export const isUserEnrolled = async (userId: string, courseId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  return enrollment !== null;
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (!enrollment) {
    throw new NotFoundError("Enrollment not found.");
  }

  return await prisma.enrollment.delete({
    where: { userId_courseId: { userId, courseId } },
  });
};

export const getEnrollmentById = async (
  id: string,
  requesterId: string,
  requesterRole: string
) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: {
      user: true,
      course: {
        select: {
          id: true,
          title: true,
          userId: true,
        },
      },
    },
  });

  if (!enrollment) {
    throw new NotFoundError("Enrollment not found.");
  }

  const isAdmin = requesterRole === "admin";
  const isStudent = enrollment.userId === requesterId;
  const isInstructor = enrollment.course.userId === requesterId;

  if (!isAdmin && !isStudent && !isInstructor) {
    throw new ForbiddenError("Access denied.");
  }

  return enrollment;
};

export const getAllEnrollments = async (requesterRole: string) => {
  if (requesterRole !== "admin") {
    throw new ForbiddenError("Only admins can access all enrollments.");
  }

  return await prisma.enrollment.findMany({
    include: {
      user: true,
      course: true,
    },
  });
};

export const getEnrollmentsByCourseId = async (
  courseId: string,
  requesterId: string
) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new NotFoundError("Course not found.");
  }

  if (course.userId !== requesterId) {
    throw new ForbiddenError("Access denied. Not the owner of this course.");
  }

  return await prisma.enrollment.findMany({
    where: { courseId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};