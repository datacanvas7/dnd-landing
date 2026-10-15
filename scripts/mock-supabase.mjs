// Minimal mock of the Supabase PostgREST API — ONLY for local end-to-end
// testing of the waitlist flow. Emulates:
//   POST /rest/v1/dnd_waitlist        → insert (201)
//   duplicate email                   → 409 with PostgREST error body
//   GET  /auth/v1/health              → {"date": "..."} (client health check)
import http from "node:http";

const rows = [];

const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    const url = new URL(req.url, "http://localhost");
    console.log(`[mock] ${req.method} ${url.pathname}`);

    if (url.pathname === "/auth/v1/health" || url.pathname === "/rest/v1/") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ date: new Date().toISOString() }));
      return;
    }

    if (url.pathname === "/rest/v1/dnd_waitlist" && req.method === "POST") {
      let row;
      try {
        row = JSON.parse(body);
      } catch {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "invalid body" }));
        return;
      }
      if (rows.some((r) => r.email === row.email)) {
        // PostgREST unique-violation shape (code 23505)
        res.writeHead(409, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            code: "23505",
            details: "Key (email)=(x) already exists.",
            hint: null,
            message: 'duplicate key value violates unique constraint "dnd_waitlist_email_unique_idx"',
          }),
        );
        return;
      }
      rows.push(row);
      console.log("[mock] stored:", JSON.stringify(row));
      res.writeHead(201, { "content-type": "application/json" });
      res.end(JSON.stringify([{ id: crypto.randomUUID(), ...row }]));
      return;
    }

    if (url.pathname === "/debug/rows") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(rows, null, 2));
      return;
    }

    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "not found", path: url.pathname }));
  });
});

server.listen(54321, () => console.log("[mock] supabase mock on :54321"));
