import {
  Response,
  serve,
  Server,
  ServerRequest,
} from "https://deno.land/std@0.103.0/http/server.ts";
import { Status } from "https://deno.land/std@0.103.0/http/http_status.ts";
const server: Server = serve({ port: 8000 });

console.log("Client Server running at http://localhost:8000");

// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for-await...of
for await (const request: ServerRequest of server) {
  const response: Response = {
    status: Status.Found,
    // Headers はトップレベルで定義されている
    headers: new Headers([["Location", "http://localhost:8001"]]),
  };

  request.respond(response);
}
