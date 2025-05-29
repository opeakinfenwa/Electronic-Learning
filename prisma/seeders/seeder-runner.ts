import fs from "fs";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const SEEDERS_DIR = path.join(__dirname);
const SQL_DIR = path.join(SEEDERS_DIR, "sql");
const UNDO_DIR = path.join(SEEDERS_DIR, "undo");
const HISTORY_FILE = path.join(SEEDERS_DIR, "seeder-history.json");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const readHistory = (): string[] => {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  return JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8"));
};

const writeHistory = (history: string[]) => {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
};

const applySeeders = async () => {
  const applied = readHistory();
  const seedFiles = fs.readdirSync(SQL_DIR).sort();

  for (const file of seedFiles) {
    if (applied.includes(file)) continue;

    const sql = fs.readFileSync(path.join(SQL_DIR, file), "utf-8");
    console.log(`Applying ${file}`);
    console.log(`Seeded database successfully`);
    await client.query(sql);
    applied.push(file);
    writeHistory(applied);
  }
};

const rollbackSeeders = async () => {
  const applied = readHistory();
  if (applied.length === 0) {
    console.log("No seeders to rollback.");
    return;
  }

  const last = applied.pop()!;
  const sql = fs.readFileSync(path.join(UNDO_DIR, last), "utf-8");
  console.log(`Rolling back ${last}`);
  console.log(` Undo seed succesfully `);
  await client.query(sql);
  writeHistory(applied);
};

(async () => {
  await client.connect();

  const action = process.argv[2];
  if (action === "down") {
    await rollbackSeeders();
  } else {
    await applySeeders();
  }

  await client.end();
})();