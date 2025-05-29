import { prisma } from "../config/db";
import { NotFoundError, UnauthorizedError } from "../errors/customErrors";
import {
  generateAuthToken,
  comparePassword,
  hashPassword,
  compareSecurityAnswer,
} from "../utils/authUtils";

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      authProvider: "local",
    },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  if (!user.password) {
    throw new UnauthorizedError("This user account has no password set.");
  }

  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const token = await generateAuthToken({ id: user.id, role: user.role });

  return { token, user };
};

export const resetPassword = async (
  email: string,
  securityAnswer: string,
  newPassword: string
) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      authProvider: "local",
    },
  });

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  if (!user.securityAnswer) {
    throw new UnauthorizedError("Security answer is not set for this user.");
  }

  const isAnswerCorrect = await compareSecurityAnswer(
    securityAnswer,
    user.securityAnswer
  );

  if (!isAnswerCorrect) {
    throw new UnauthorizedError("Incorrect security answer.");
  }

  const hashedPassword = await hashPassword(newPassword);

  return await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.password) {
    throw new NotFoundError("User not found or no password set.");
  }

  const isCurrentValid = await comparePassword(currentPassword, user.password);

  if (!isCurrentValid) {
    throw new UnauthorizedError("Current password is incorrect.");
  }

  const hashedPassword = await hashPassword(newPassword);

  return await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};