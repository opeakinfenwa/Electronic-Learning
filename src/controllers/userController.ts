import { Request, Response, NextFunction } from "express";
import { signupUser, updateUser, deleteUser } from "../services/userService";
import { signupSchema, updateUserSchema } from "../validations/userValidation";
import { ZodError } from "zod";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsedData = signupSchema.parse(req.body);

    const {
      email,
      name,
      password,
      role,
      authProvider,
      securityQuestion,
      securityAnswer,
    } = parsedData;

    const user = await signupUser(
      email,
      name,
      password,
      role,
      authProvider,
      securityQuestion,
      securityAnswer
    );

    res.status(201).json({
      success: true,
      message: "Signup successful",
      data: user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
      return;
    }

    console.error("Error Signing Up User:", error);
    next(error);
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const requesterId = req.user.id;

    const updates = updateUserSchema.parse(req.body);
    const updatedUser = await updateUser(userId, requesterId, updates);

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    next(error);
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;

    const result = await deleteUser(userId, requesterId, requesterRole);
    res.status(200).json({
      message: "User deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};