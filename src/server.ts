import app from "./app";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import logger from "./config/logger";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default server;