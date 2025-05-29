import { Request, Response, NextFunction } from "express";
import {
  loginUser,
  resetPassword,
  changePassword,
} from "../services/authService";
import { loginSchema } from "../validations/authvalidation";
import { ZodError } from "zod";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const { token, user } = await loginUser(email, password);

    res
      .setHeader("Authorization", `Bearer ${token}`)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: true,
      })
      .status(200)
      .json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }

    console.error("Error Logging In User:", error);
    next(error);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: true,
      })
      .setHeader("Authorization", "")
      .status(200)
      .json({
        success: true,
        message: "Logout Successfully",
      });
  } catch (error) {
    console.error("Error Login Out User:", error);
    next(error);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, securityAnswer, newPassword } = req.body;
    const result = await resetPassword(email, securityAnswer, newPassword);
    res.status(200).json({
      message: "Password reset successfull",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const result = await changePassword(userId, currentPassword, newPassword);
    res.status(200).json({
      messsage: "Password changed successfull",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};