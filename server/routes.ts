import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  authMiddleware,
  clearSessionCookie,
  getLicenseStatus,
  getUserFromSession,
  loginUser,
  requireAuth,
  requireRole,
  requireWriteAccess,
  SESSION_COOKIE,
  type SessionUser,
  setSessionCookie,
} from "./auth.js";
import { audit, getDb, initDb } from "./db.js";

type Variables = { user: SessionUser };

const app = new Hono<{ Variables: Variables }>();

app.use(
  "*",
  cors({
    origin: (origin, c) => {
      if (origin) return origin;
      try {
        return new URL(c.req.url).origin;
      } catch {
        return "http://localhost:5173";
      }
    },
    credentials: true,
  }),
);

app.use("*", authMiddleware());

if (!process.env.VERCEL) {
  initDb();
}

function getSessionId(c: {
  req: { header: (n: string) => string | undefined };
}) {
  const cookie = c.req.header("cookie");
  if (!cookie) return undefined;
  const match = cookie.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

// ─── Auth ───────────────────────────────────────────────────────
app.post("/api/auth/login", async c => {
  try {
    const body = await c.req.json<{ username: string; password: string }>();
    const user = loginUser(body.username?.trim() ?? "", body.password ?? "");
    if (!user) return c.json({ error: "Invalid credentials" }, 401);
    setSessionCookie(c, user);
    audit(user.id, "login", "auth");
    return c.json({ user });
  } catch (err) {
    console.error("[auth/login]", err);
    return c.json({ error: "Login failed" }, 500);
  }
});

app.post("/api/auth/logout", requireAuth(), async c => {
  const user = c.get("user");
  audit(user.id, "logout", "auth");
  clearSessionCookie(c);
  return c.json({ ok: true });
});

app.get("/api/auth/me", async c => {
  const sessionId = getSessionId(c);
  const user = getUserFromSession(sessionId);
  if (!user) return c.json({ user: null });
  return c.json({ user });
});

// ─── License ────────────────────────────────────────────────────
app.get("/api/license", requireAuth(), c => {
  return c.json(getLicenseStatus());
});

app.put("/api/license", requireAuth(), requireRole("admin"), async c => {
  const body = await c.req.json<{
    expiresAt: string;
    maintenanceActive: boolean;
  }>();
  const license = {
    valid: true,
    expiresAt: body.expiresAt,
    maintenanceActive: body.maintenanceActive,
  };
  getDb()
    ?.prepare(
      "INSERT INTO app_settings (key, value) VALUES ('license', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    )
    .run(JSON.stringify(license));
  audit(c.get("user").id, "license_update", "license", license);
  return c.json(getLicenseStatus());
});

// ─── Brand / Settings ───────────────────────────────────────────
app.get("/api/settings/customer", requireAuth(), c => {
  const db = getDb();
  const row = db
    ?.prepare("SELECT value FROM app_settings WHERE key = 'customer'")
    .get() as { value: string } | undefined;
  return c.json(row ? JSON.parse(row.value) : {});
});

app.put(
  "/api/settings/customer",
  requireAuth(),
  requireRole("admin"),
  requireWriteAccess(),
  async c => {
    const db = getDb();
    const body = await c.req.json();
    db?.prepare(
      "INSERT INTO app_settings (key, value) VALUES ('customer', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    ).run(JSON.stringify(body));
    audit(c.get("user").id, "customer_update", "settings");
    return c.json(body);
  },
);

app.get("/api/settings/brand", requireAuth(), c => {
  const row = getDb()
    ?.prepare("SELECT value FROM app_settings WHERE key = 'brand'")
    .get() as { value: string } | undefined;
  return c.json(row ? JSON.parse(row.value) : {});
});

app.put(
  "/api/settings/brand",
  requireAuth(),
  requireRole("admin"),
  requireWriteAccess(),
  async c => {
    const body = await c.req.json();
    getDb()
      ?.prepare(
        "INSERT INTO app_settings (key, value) VALUES ('brand', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      )
      .run(JSON.stringify(body));
    audit(c.get("user").id, "brand_update", "settings");
    return c.json(body);
  },
);

app.get("/api/settings/column-mapping", requireAuth(), c => {
  const row = getDb()
    ?.prepare("SELECT value FROM app_settings WHERE key = 'column_mapping'")
    .get() as { value: string } | undefined;
  return c.json(row ? JSON.parse(row.value) : {});
});

app.put(
  "/api/settings/column-mapping",
  requireAuth(),
  requireRole("admin", "editor"),
  requireWriteAccess(),
  async c => {
    const body = await c.req.json();
    getDb()
      ?.prepare(
        "INSERT INTO app_settings (key, value) VALUES ('column_mapping', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      )
      .run(JSON.stringify(body));
    audit(c.get("user").id, "column_mapping_update", "settings");
    return c.json(body);
  },
);

// ─── Users ──────────────────────────────────────────────────────
app.get("/api/users", requireAuth(), requireRole("admin"), c => {
  const users =
    getDb()
      ?.prepare(
        "SELECT id, username, role, created_at FROM users ORDER BY username",
      )
      .all() ?? [];
  return c.json(users);
});

app.post(
  "/api/users",
  requireAuth(),
  requireRole("admin"),
  requireWriteAccess(),
  async c => {
    const body = await c.req.json<{
      username: string;
      password: string;
      role: SessionUser["role"];
    }>();
    const bcrypt = await import("bcryptjs");
    const id = crypto.randomUUID();
    try {
      const db = getDb();
      if (!db) return c.json({ error: "Database unavailable" }, 503);
      db.prepare(
        "INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)",
      ).run(id, body.username, bcrypt.hashSync(body.password, 10), body.role);
      audit(c.get("user").id, "user_create", "users", {
        username: body.username,
      });
      return c.json({ id, username: body.username, role: body.role }, 201);
    } catch {
      return c.json({ error: "Username already exists" }, 409);
    }
  },
);

app.delete(
  "/api/users/:id",
  requireAuth(),
  requireRole("admin"),
  requireWriteAccess(),
  c => {
    const id = c.req.param("id");
    const me = c.get("user");
    if (id === me.id) return c.json({ error: "Cannot delete yourself" }, 400);
    getDb()?.prepare("DELETE FROM users WHERE id = ?").run(id);
    audit(me.id, "user_delete", "users", { id });
    return c.json({ ok: true });
  },
);

// ─── Dashboard / Uploads ────────────────────────────────────────
app.get("/api/dashboard/active", requireAuth(), c => {
  const row = getDb()
    ?.prepare(
      "SELECT id, file_name, data_json, validation_json, created_at FROM dashboard_uploads WHERE is_active = 1 LIMIT 1",
    )
    .get() as
    | {
        id: string;
        file_name: string | null;
        data_json: string;
        validation_json: string | null;
        created_at: string;
      }
    | undefined;

  if (!row) return c.json({ active: null });
  return c.json({
    active: {
      id: row.id,
      fileName: row.file_name,
      data: JSON.parse(row.data_json),
      validation: row.validation_json ? JSON.parse(row.validation_json) : null,
      createdAt: row.created_at,
    },
  });
});

app.get("/api/dashboard/uploads", requireAuth(), c => {
  const rows = (getDb()
    ?.prepare(
      "SELECT id, file_name, is_active, uploaded_by, created_at, validation_json FROM dashboard_uploads ORDER BY created_at DESC",
    )
    .all() ?? []) as Array<{
    id: string;
    file_name: string | null;
    is_active: number;
    uploaded_by: string | null;
    created_at: string;
    validation_json: string | null;
  }>;

  return c.json(
    rows.map(r => ({
      id: r.id,
      fileName: r.file_name,
      isActive: r.is_active === 1,
      uploadedBy: r.uploaded_by,
      createdAt: r.created_at,
      validation: r.validation_json ? JSON.parse(r.validation_json) : null,
    })),
  );
});

app.post(
  "/api/dashboard/upload",
  requireAuth(),
  requireWriteAccess(),
  async c => {
    const user = c.get("user");
    if (user.role === "viewer") return c.json({ error: "Forbidden" }, 403);

    const body = await c.req.json<{
      fileName?: string;
      data: unknown;
      validation?: unknown;
    }>();

    const db = getDb();
    if (!db) return c.json({ error: "Database unavailable" }, 503);
    const id = crypto.randomUUID();
    db.prepare("UPDATE dashboard_uploads SET is_active = 0").run();
    db.prepare(
      `INSERT INTO dashboard_uploads (id, file_name, data_json, validation_json, is_active, uploaded_by)
     VALUES (?, ?, ?, ?, 1, ?)`,
    ).run(
      id,
      body.fileName ?? null,
      JSON.stringify(body.data),
      body.validation ? JSON.stringify(body.validation) : null,
      user.username,
    );

    audit(user.id, "dashboard_upload", "dashboard", {
      fileName: body.fileName,
      uploadId: id,
    });
    return c.json({ id, ok: true }, 201);
  },
);

app.post(
  "/api/dashboard/uploads/:id/activate",
  requireAuth(),
  requireWriteAccess(),
  c => {
    const id = c.req.param("id");
    const db = getDb();
    if (!db) return c.json({ error: "Database unavailable" }, 503);
    const exists = db
      .prepare("SELECT id FROM dashboard_uploads WHERE id = ?")
      .get(id);
    if (!exists) return c.json({ error: "Not found" }, 404);
    db.prepare("UPDATE dashboard_uploads SET is_active = 0").run();
    db.prepare("UPDATE dashboard_uploads SET is_active = 1 WHERE id = ?").run(
      id,
    );
    audit(c.get("user").id, "dashboard_activate", "dashboard", {
      uploadId: id,
    });
    return c.json({ ok: true });
  },
);

// ─── Contracts ──────────────────────────────────────────────────
app.get("/api/contracts", requireAuth(), c => {
  const rows =
    getDb()
      ?.prepare("SELECT * FROM contracts ORDER BY last_updated DESC")
      .all() ?? [];
  return c.json(
    (rows as Array<Record<string, unknown>>).map(r => ({
      id: r.id,
      network: r.network,
      title: r.title,
      type: r.type,
      status: r.status,
      startDate: r.start_date,
      endDate: r.end_date,
      volumeMB3: r.volume_mb3,
      volumeNN: r.volume_nn,
      payrate: r.payrate,
      conditions: r.conditions,
      responsible: r.responsible,
      lastUpdated: r.last_updated,
      notes: r.notes,
    })),
  );
});

app.post("/api/contracts", requireAuth(), requireWriteAccess(), async c => {
  const b = await c.req.json();
  const id = b.id ?? `V-${Date.now()}`;
  const db = getDb();
  if (!db) return c.json({ error: "Database unavailable" }, 503);
  db.prepare(
    `INSERT INTO contracts (id, network, title, type, status, start_date, end_date, volume_mb3, volume_nn, payrate, conditions, responsible, last_updated, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    b.network,
    b.title,
    b.type,
    b.status,
    b.startDate,
    b.endDate,
    b.volumeMB3,
    b.volumeNN,
    b.payrate,
    b.conditions,
    b.responsible,
    b.lastUpdated ?? new Date().toISOString().slice(0, 10),
    b.notes ?? "",
  );
  audit(c.get("user").id, "contract_create", "contracts", { id });
  return c.json({ id }, 201);
});

app.put("/api/contracts/:id", requireAuth(), requireWriteAccess(), async c => {
  const id = c.req.param("id");
  const b = await c.req.json();
  const db = getDb();
  if (!db) return c.json({ error: "Database unavailable" }, 503);
  db.prepare(
    `UPDATE contracts SET network=?, title=?, type=?, status=?, start_date=?, end_date=?,
     volume_mb3=?, volume_nn=?, payrate=?, conditions=?, responsible=?, last_updated=?, notes=?
     WHERE id=?`,
  ).run(
    b.network,
    b.title,
    b.type,
    b.status,
    b.startDate,
    b.endDate,
    b.volumeMB3,
    b.volumeNN,
    b.payrate,
    b.conditions,
    b.responsible,
    b.lastUpdated,
    b.notes,
    id,
  );
  audit(c.get("user").id, "contract_update", "contracts", { id });
  return c.json({ ok: true });
});

app.delete("/api/contracts/:id", requireAuth(), requireWriteAccess(), c => {
  const id = c.req.param("id");
  getDb()?.prepare("DELETE FROM contracts WHERE id = ?").run(id);
  audit(c.get("user").id, "contract_delete", "contracts", { id });
  return c.json({ ok: true });
});

// ─── Scorecards ─────────────────────────────────────────────────
app.get("/api/scorecards", requireAuth(), c => {
  const rows = (getDb()
    ?.prepare("SELECT network, data_json FROM scorecards")
    .all() ?? []) as Array<{
    network: string;
    data_json: string;
  }>;
  return c.json(rows.map(r => JSON.parse(r.data_json)));
});

app.put(
  "/api/scorecards/:network",
  requireAuth(),
  requireWriteAccess(),
  async c => {
    const network = decodeURIComponent(c.req.param("network"));
    const body = await c.req.json();
    getDb()
      ?.prepare(
        "INSERT INTO scorecards (network, data_json) VALUES (?, ?) ON CONFLICT(network) DO UPDATE SET data_json = excluded.data_json",
      )
      .run(network, JSON.stringify(body));
    audit(c.get("user").id, "scorecard_update", "scorecards", { network });
    return c.json({ ok: true });
  },
);

// ─── Audit ──────────────────────────────────────────────────────
app.get("/api/audit", requireAuth(), requireRole("admin"), c => {
  const limit = Number(c.req.query("limit") ?? 100);
  const rows =
    getDb()
      ?.prepare(
        `SELECT a.*, u.username FROM audit_log a
       LEFT JOIN users u ON u.id = a.user_id
       ORDER BY a.created_at DESC LIMIT ?`,
      )
      .all(limit) ?? [];
  return c.json(rows);
});

app.get("/api/health", c => {
  return c.json({
    ok: true,
    db: !!getDb(),
    vercel: !!process.env.VERCEL,
  });
});

// SSO stub (Phase 4)
app.get("/api/auth/sso", c => {
  return c.json({
    enabled: false,
    message:
      "SSO not configured. Use local login or contact your administrator.",
  });
});

export { app };
