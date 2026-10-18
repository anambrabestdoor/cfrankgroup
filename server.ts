import { createServer } from "http";
import { parse } from "url";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl as any);
  }).listen(3000, () => {
    console.log("> Ready on http://localhost:3000");
  });
}).catch((err) => {
  console.error("Error during Next.js app preparation:", err);
  process.exit(1);
});
