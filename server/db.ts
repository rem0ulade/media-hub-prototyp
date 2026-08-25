import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type Database from "better-sqlite3";
import { DEMO_ACCOUNTS } from "../shared/demo-credentials.js";
import { contracts } from "../src/data/contractData.js";
import { networkScorecards } from "../src/data/scorecardData.js";
import { getDemoPasswordHash } from "./demo-users.js";

const require = createRequire(import.meta.url);

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir =
  process.env.DATA_DIR ??
  (process.env.VERCEL ? "/tmp/management-hub" : join(__dirname, "..", "data"));
const dbPath = process.env.DATABASE_PATH ?? join(dataDir, "hub.db");

let db: Database.Database | null = null;
let dbReady = false;
let dbError: string | null = null;

export function isDbReady(): boolean {
  return dbReady;
}

export function getDb(): Database.Database | null {
  return db;
}

export function getDbError(): string | null {
  return dbError;
}

export function initDb(): boolean {
  if (dbReady) return true;
  try {
    mkdirSync(dataDir, { recursive: true });
    const BetterSqlite3 =
      require("better-sqlite3") as typeof import("better-sqlite3");
    db = new BetterSqlite3(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    runMigrations();
    seedIfEmpty();
    migrateDemoBrand();
    dbReady = true;
    dbError = null;
    return true;
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Database init failed";
    console.error("[db] init failed:", dbError);
    db = null;
    dbReady = false;
    return false;
  }
}

function runMigrations() {
  if (!db) return;
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'editor', 'viewer')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS dashboard_uploads (
      id TEXT PRIMARY KEY,
      file_name TEXT,
      data_json TEXT NOT NULL,
      validation_json TEXT,
      is_active INTEGER NOT NULL DEFAULT 0,
      uploaded_by TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contracts (
      id TEXT PRIMARY KEY,
      network TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      volume_mb3 REAL,
      volume_nn REAL,
      payrate REAL,
      conditions TEXT,
      responsible TEXT,
      last_updated TEXT NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS scorecards (
      network TEXT PRIMARY KEY,
      data_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      action TEXT NOT NULL,
      resource TEXT,
      details TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_uploads_active ON dashboard_uploads(is_active);
  `);
}

function seedIfEmpty() {
  if (!db) return;
  const userCount = db.prepare("SELECT COUNT(*) as c FROM users").get() as {
    c: number;
  };
  if (userCount.c > 0) return;

  const insertUser = db.prepare(
    "INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)",
  );
  for (const account of DEMO_ACCOUNTS) {
    insertUser.run(
      account.id,
      account.username,
      getDemoPasswordHash(account.password),
      account.role,
    );
  }

  const defaultBrand = {
    companyName: "MediaHub",
    tagline: "Partner Intelligence",
    fiscalYear: "CY 2026",
    dataAsOf: "24. August 2026",
    platformLabel: "Classic & Programmatic",
    defaultContact: "Account Management",
    exportFileName: "mediahub-export",
    pageTitle: "MediaHub — Partner Intelligence",
    locale: "de",
  };

  db.prepare("INSERT INTO app_settings (key, value) VALUES (?, ?)").run(
    "brand",
    JSON.stringify(defaultBrand),
  );

  db.prepare("INSERT INTO app_settings (key, value) VALUES (?, ?)").run(
    "column_mapping",
    JSON.stringify({}),
  );

  const licenseExpires =
    process.env.LICENSE_EXPIRES ??
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare("INSERT INTO app_settings (key, value) VALUES (?, ?)").run(
    "license",
    JSON.stringify({
      valid: true,
      expiresAt: licenseExpires,
      maintenanceActive: true,
    }),
  );

  seedDemoData();
}

function seedDemoData() {
  if (!db) return;
  try {
    const contractCount = db
      .prepare("SELECT COUNT(*) as c FROM contracts")
      .get() as { c: number };
    if (contractCount.c === 0) {
      const stmt = db.prepare(
        `INSERT INTO contracts (id, network, title, type, status, start_date, end_date, volume_mb3, volume_nn, payrate, conditions, responsible, last_updated, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      );
      for (const c of contracts) {
        stmt.run(
          c.id,
          c.network,
          c.title,
          c.type,
          c.status,
          c.startDate,
          c.endDate,
          c.volumeMB3,
          c.volumeNN,
          c.payrate,
          c.conditions,
          c.responsible,
          c.lastUpdated,
          c.notes,
        );
      }
    }

    const scoreCount = db
      .prepare("SELECT COUNT(*) as c FROM scorecards")
      .get() as { c: number };
    if (scoreCount.c === 0) {
      const stmt = db.prepare(
        "INSERT INTO scorecards (network, data_json) VALUES (?, ?)",
      );
      for (const s of networkScorecards) {
        stmt.run(s.network, JSON.stringify(s));
      }
    }
  } catch {
    /* optional seed */
  }
}

function migrateDemoBrand() {
  if (!db) return;
  const row = db
    .prepare("SELECT value FROM app_settings WHERE key = 'brand'")
    .get() as { value: string } | undefined;
  if (!row) return;
  try {
    const brand = JSON.parse(row.value) as Record<string, string>;
    let changed = false;
    if (brand.platformLabel === "IO & Programmatic") {
      brand.platformLabel = "Classic & Programmatic";
      changed = true;
    }
    if (
      brand.dataAsOf === "1. Mai 2026" ||
      brand.dataAsOf === "31. Juli 2026"
    ) {
      brand.dataAsOf = "24. August 2026";
      changed = true;
    }
    if (brand.tagline === "Partner Intelligence Platform") {
      brand.tagline = "Partner Intelligence";
      changed = true;
    }
    if (!changed) return;
    db.prepare("UPDATE app_settings SET value = ? WHERE key = 'brand'").run(
      JSON.stringify(brand),
    );
  } catch {
    /* ignore malformed brand json */
  }
}

export function audit(
  userId: string | null,
  action: string,
  resource?: string,
  details?: Record<string, unknown>,
) {
  if (!db) return;
  try {
    db.prepare(
      "INSERT INTO audit_log (user_id, action, resource, details) VALUES (?, ?, ?, ?)",
    ).run(
      userId,
      action,
      resource ?? null,
      details ? JSON.stringify(details) : null,
    );
  } catch {
    /* ignore */
  }
}
