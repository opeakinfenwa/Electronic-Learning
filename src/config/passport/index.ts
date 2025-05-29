import passport from "passport";
import { jwtStrategy } from "./jwtStrategy";
import { googleStrategy } from "./googleStrategy";

passport.use(jwtStrategy);
passport.use(googleStrategy);

export default passport;