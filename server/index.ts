import { serve } from "@hono/node-server";
import { initDb } from "./db.js";
import { app } from "./routes.js";

initDb();

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "127.0.0.1";

console.log(`Management Hub API → http://${host}:${port}`);

serve({ fetch: app.fetch, port, hostname: host });
