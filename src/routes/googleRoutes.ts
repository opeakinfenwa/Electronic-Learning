import express, { Request, Response } from "express";
import passport from "passport";
import { isAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send(`<a href="/auth/google"> Authenticate with Google</a>`);
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: Request, res: Response) => {
    if (!req.user) {
      return res.redirect("/auth/failure");
    }

    if ("token" in req.user && "user" in req.user) {
      const { token, user } = req.user as {
        token: string;
        user: { id: string; email: string; role: string; name: string };
      };

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      return res.redirect(`/auth/dashboard?token=${token}`);
    } else {
      return res.redirect("/auth/failure");
    }
  }
);

router.get("/dashboard", isAuth, (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "Welcome to your dashboard!",
    user: req.user,
  });
});

router.get("/failure", (req: Request, res: Response) => {
  return res.status(401).json({
    success: false,
    message: "Authentication failed. Please try again.",
  });
});

export default router;