import { prisma } from "../config/db";

export const createCourse = async (
  title: string,
  description: string,
  userId: string
) => {
  return await prisma.course.create({
    data: {
      title,
      description,
      userId,
    },
  });
};

export const getAllCourses = async () => {
  return await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const getUserCourses = async (userId: string) => {
  return await prisma.course.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getCourseById = async (id: string) => {
  return await prisma.course.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  });
};

export const updateCourse = async (
  id: string,
  updates: { title?: string; description?: string }
) => {
  return await prisma.course.update({
    where: { id },
    data: updates,
  });
};

export const deleteCourse = async (id: string) => {
  return await prisma.course.delete({
    where: { id },
  });
};