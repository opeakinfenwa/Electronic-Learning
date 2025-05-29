import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import registerRoutes from "./routes";
import { errorHandler } from "./errors/handleErrors";
import "./config/passport";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
registerRoutes(app);

app.use(errorHandler);

export default app;