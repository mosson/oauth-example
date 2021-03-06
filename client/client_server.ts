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
  // TODO session cookie handling
  // TODO routing
  // TODO logging
  switch (request.url) {
    case "/authorize":
      handleAuthorize(request);
      break;
    case "/callback":
      handleCallback(request);
      break;
    default:
      // TODO rendering HTML
      request.respond({ body: "Client Server Root" });
  }
}

function handleAuthorize(request: ServerRequest): void {
  const response: Response = {
    status: Status.Found,
    // Headers はトップレベルで定義されている
    headers: new Headers([["Location", "http://localhost:8001"]]),
  };

  request.respond(response);
}

function handleCallback(request: ServerRequest): void {
  request.respond({ body: "Handle Callback" });
}
