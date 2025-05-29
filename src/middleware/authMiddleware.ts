import Jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../errors/customErrors";

dotenv.config();

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      throw new UnauthorizedError("Unauthorized User");
    }

    const decoded = Jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
    req.user = {
      id: decoded.id.toString(),
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
    };
    next();
  } catch (error) {
    console.error("Error Authenticating User:", error);
    next(error);
  }
};

export const isInstructorOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "instructor") {
      throw new ForbiddenError(
        "Access Restricted To Instructors Or Admins Only"
      );
    }
    next();
  } catch (error) {
    console.error("Error Authenticating Instructor/Admin:", error);
    next(error);
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== "admin") {
      throw new ForbiddenError("Access Restricted To Admins Only");
    }
    next();
  } catch (error) {
    console.error("Error Authenticating Admin:", error);
    next(error);
  }
};

export const isInstructor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.role !== "instructor") {
      throw new ForbiddenError("Access Restricted To Instructors Only");
    }
    next();
  } catch (error) {
    console.error("Error Authenticating Instructors:", error);
    next(error);
  }
};

export const isStudent = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== "student") {
      throw new ForbiddenError("Access Restricted To Students Only");
    }
    next();
  } catch (error) {
    console.error("Error Authenticating Student:", error);
    next(error);
  }
};