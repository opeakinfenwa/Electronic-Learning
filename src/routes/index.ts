import user from "./userRoutes";
import auth from "./authRoutes";
import googleAuth from "./googleRoutes";
import course from "./courseRoutes";
import enroll from "./enrollRoutes";
import lesson from "./lessonRoutes";
import { Express } from "express-serve-static-core";

const registerRoutes = function (app: Express) {
  app.use("/api/users", user);
  app.use("/api/auth", auth);
  app.use("/auth", googleAuth);
  app.use("/course", course);
  app.use("/enroll", enroll);
  app.use("/enroll", enroll);
  app.use("/lesson", lesson);
};

export default registerRoutes;