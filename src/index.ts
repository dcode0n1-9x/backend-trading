import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { signUpRouter } from "./routes/signup.routes";
import openapi from "@elysiajs/openapi";
import { handleResponse, ILang, Lang } from "./utils/responseCodec";
import { config } from "./config/generalconfig";


const app = new Elysia({
  aot: true,  // build time optimization,
  prefix: "/api",
  ...(config.BUN_ENV === 'production' && {
    hostname: config.HOSTNAME,
      tls: {
        cert: "./certs/cert.pem",
        key: "./certs/key.pem"
      }
    }
  )
})
  .use(
    cors({
      origin: "*",
    })
  )
  .use(openapi())
  .get("/health", () => "Working fine")
  .use(signUpRouter);

export type App = typeof app;

app.listen(3001, () => console.log("running at 3001"));

export default app;
