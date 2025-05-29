import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prisma } from "../db";

dotenv.config();

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "http://localhost:5001/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const googleId = profile.id;
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName;

      if (!email)
        return done(
          new Error("Email not available from Google profile"),
          false
        );

      let user = await prisma.user.findUnique({
        where: { googleId },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            googleId,
            email,
            name,
            role: "student",
            authProvider: "google",
          },
        });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return done(null, { user, token });
    } catch (err) {
      return done(err, false);
    }
  }
);