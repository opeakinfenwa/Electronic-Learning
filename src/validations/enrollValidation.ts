import { z } from "zod";

export const enrollInCourseSchema = z.object({
  courseId: z.string().uuid(),
});