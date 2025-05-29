import fs from "fs";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.DATABASE_URL!;
const MIGRATIONS_DIR = __dirname;
const UP_DIR = path.join(MIGRATIONS_DIR, "up");
const DOWN_DIR = path.join(MIGRATIONS_DIR, "down");
const HISTORY_FILE = path.join(MIGRATIONS_DIR, "migration-history.json");
const loadHistory = (): string[] => {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  return JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8"));
};

const saveHistory = (history: string[]) => {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
};

const runSQL = async (filePath: string, client: Client) => {
  const sql = fs.readFileSync(filePath, "utf-8");
  await client.query(sql);
};

const migrate = async (direction: "up" | "down") => {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();

  try {
    const applied = loadHistory();
    const dir = direction === "up" ? UP_DIR : DOWN_DIR;
    const files = fs.readdirSync(dir).sort();

    if (direction === "down") files.reverse();

    for (const file of files) {
      const id = file.split("_")[0];
      const alreadyApplied = applied.includes(id);

      if (
        (direction === "up" && alreadyApplied) ||
        (direction === "down" && !alreadyApplied)
      ) {
        continue;
      }

      console.log(`Running ${direction} migration: ${file}`);
      await runSQL(path.join(dir, file), client);

      if (direction === "up") applied.push(id);
      else applied.splice(applied.indexOf(id), 1);

      saveHistory(applied);
    }

    console.log(`Migration ${direction} complete.`);
  } catch (error) {
    console.error(`Migration ${direction} failed:`, error);
  } finally {
    await client.end();
  }
};

const direction = process.argv[2] as "up" | "down";
if (!["up", "down"].includes(direction)) {
  console.error("Usage: ts-node migration-runner.ts <up|down>");
  process.exit(1);
}

migrate(direction);