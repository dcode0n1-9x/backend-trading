import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { indexRouter } from "./routes/index";
import openapi from "@elysiajs/openapi";
// import { handleResponse, ILang, Lang } from "./utils/responseCodec";
// import { opentelemetry } from '@elysiajs/opentelemetry'
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
  .use(openapi({
    documentation: {
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      },
      info: {
        title: "MoneyplantFX Backend API",
        description: "API documentation for MoneyplantFX Backend services",
        version: "1.0.0"
      }
    }
  }))
  .get("/health", () => "Working fine" , {
    detail: {
      tags: ["Health Check"],
      description: "Health check endpoint to verify server status"
    }
  })
  .use(indexRouter.signUpRouter)
  .use(indexRouter.forgetPasswordRoutes)
  .use(indexRouter.authRouter)
  .use(indexRouter.dashboardRouter)
  .use(indexRouter.watchlistRouter)
  .use(indexRouter.watchlistGroupRouter)
  .use(indexRouter.watchlistItemRouter)
  .use(indexRouter.orderRoutes)

export type App = typeof app;

app.listen(config.PORT, () => console.log("running at 3000"));

export default app;
