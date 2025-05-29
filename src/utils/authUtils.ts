import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const hashPassword = async (password: string) => {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
};

export const hashSecurityAnswer = async (answer: string) => {
  const hashedAnswer = await bcrypt.hash(answer, 10);
  return hashedAnswer;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

export const generateAuthToken = async (payload: {
  id: string;
  role: string;
}) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
  return token;
};

export const compareSecurityAnswer = async (
  providedAnswer: string,
  storedHashedAnswer: string
): Promise<boolean> => {
  const normalizedAnswer = providedAnswer.trim().toLowerCase();
  const isMatch = await bcrypt.compare(normalizedAnswer, storedHashedAnswer);
  return isMatch;
};