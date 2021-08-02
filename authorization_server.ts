import {
  serve,
  Server,
  ServerRequest,
} from "https://deno.land/std@0.103.0/http/server.ts";
const server: Server = serve({ port: 8001 });

console.log("Auhotirzatoin Server running at http://localhost:8001");

for await (const req: ServerRequest of server) {
  req.respond({ body: "Here is Login Form" });
}
