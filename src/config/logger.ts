import winston from "winston";
import path from "path";

const logDir = path.join(__dirname, "../../logs");
const errorLog = path.join(logDir, "error.log");
const combinedLog = path.join(logDir, "combined.log");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: errorLog, level: "error" }),
    new winston.transports.File({ filename: combinedLog }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({ format: winston.format.simple() })
  );
}

logger.exceptions.handle(
  new winston.transports.File({ filename: path.join(logDir, "exceptions.log") })
);

process.on("unhandledRejection", (reason: any) => {
  throw reason;
});

export default logger;