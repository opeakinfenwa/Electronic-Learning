import { prisma } from "../config/db";
import { UnauthorizedError } from "../errors/customErrors";

export const createLesson = async (
  courseId: string,
  title: string,
  content: string
) => {
  return await prisma.lesson.create({
    data: { courseId, title, content },
  });
};

export const getLessonsForCourse = async (courseId: string) => {
  return await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { createdAt: "asc" },
  });
};

export const getLessonById = async (id: string) => {
  return await prisma.lesson.findUnique({ where: { id } });
};

export const updateLesson = async (
  id: string,
  updates: { title?: string; content?: string }
) => {
  return await prisma.lesson.update({
    where: { id },
    data: updates,
  });
};

export const deleteLesson = async (id: string) => {
  return await prisma.lesson.delete({ where: { id } });
};

export const getLessonsForStudent = async (
  userId: string,
  courseId: string
) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (!enrollment) {
    throw new UnauthorizedError("Student is not enrolled in this course.");
  }

  return await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { createdAt: "asc" },
  });
};