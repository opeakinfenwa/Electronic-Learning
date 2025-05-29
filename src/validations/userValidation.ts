import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(6),
  role: z.enum(["student", "instructor", "admin"]).default("student"),
  authProvider: z.literal("local").default("local"),
  securityQuestion: z.string(),
  securityAnswer: z.string()
});


export type SignupInput = z.infer<typeof signupSchema>;

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;