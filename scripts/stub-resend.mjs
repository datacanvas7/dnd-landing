/**
 * Local Resend API stub — captures the exact wire payload the app sends and
 * replies like the real API. Test-only; never imported by app code.
 *
 * Usage: node scripts/stub-resend.mjs   (listens on :5555)
 *   GET  /last   → JSON of the last captured request (headers + body)
 *   POST /emails → capture + 201 { id: "stub-..." }
 *   POST /fail   → 401 like a bad API key (for the failure-path test)
 */
import { createServer } from "node:http";

let last = null;

const server = createServer((req, res) => {
  let raw = "";
  req.on("data", (c) => (raw += c));
  req.on("end", () => {
    if (req.method === "GET" && req.url === "/last") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(last));
      return;
    }
    if (req.method === "POST" && req.url === "/emails") {
      last = {
        authorization: req.headers.authorization ?? null,
        contentType: req.headers["content-type"] ?? null,
        body: JSON.parse(raw || "{}"),
      };
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ id: `stub-${Date.now()}` }));
      return;
    }
    if (req.method === "POST" && req.url === "/fail") {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ name: "validation_error", message: "API key is invalid" }));
      return;
    }
    res.writeHead(404);
    res.end();
  });
});

server.listen(5555, () => console.log("stub-resend listening on :5555"));
