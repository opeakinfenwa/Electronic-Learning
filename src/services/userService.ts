import { prisma } from "../config/db";
import { hashPassword, hashSecurityAnswer } from "../utils/authUtils";
import { SECURITY_QUESTIONS } from "../utils/securityQuestion";
import { NotFoundError, ForbiddenError } from "../errors/customErrors";

export const signupUser = async (
  email: string,
  name: string,
  password: string,
  role: string,
  authProvider: string,
  securityQuestion: string,
  securityAnswer: string
) => {
  const googleUser = await prisma.user.findFirst({
    where: {
      email,
      googleId: {
        not: null,
      },
    },
  });

  if (googleUser) {
    throw new Error(
      "This email is already associated with a Google account. Please log in with Google."
    );
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      googleId: null,
    },
  });

  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  if (!SECURITY_QUESTIONS.includes(securityQuestion)) {
    throw new Error("Invalid security question");
  }

  const hashedPassword = await hashPassword(password);
  const hashedAnswer = await hashSecurityAnswer(securityAnswer);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role,
      authProvider,
      securityQuestion,
      securityAnswer: hashedAnswer,
    },
  });

  return user;
};

export const updateUser = async (
  id: string,
  requesterId: string,
  updates: { name?: string; email?: string }
) => {
  if (requesterId !== id) {
    throw new ForbiddenError("You are not authorized to update this user.");
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundError("User not found.");
  }

  return await prisma.user.update({
    where: { id },
    data: updates,
  });
};

export const deleteUser = async (
  id: string,
  requesterId: string,
  requesterRole: string
) => {
  if (requesterRole !== "admin" && requesterId !== id) {
    throw new ForbiddenError("You are not authorized to delete this user.");
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundError("User not found.");
  }

  return await prisma.user.delete({ where: { id } });
};