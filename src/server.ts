import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { indexRouter } from "./routes/index";
import openapi from "@elysiajs/openapi";
import { config } from "./config/generalconfig";
// import prometheusPlugin from 'elysia-prometheus'


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
// .use(
//   prometheusPlugin({
//     metricsPath: '/metrics',
//     staticLabels: { service: 'my-app' },
//     dynamicLabels: {
//       userAgent: ({ request }) =>
//         request.headers.get('user-agent') ?? 'unknown'
//     },
//     useRoutePath : true
//   })
// )
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
      summary: "Health Check Endpoint",
      description: "Health check endpoint to verify server status"
    }
  })
  .use(indexRouter.signUpRouter)
  .use(indexRouter.forgetPasswordRouter)
  .use(indexRouter.authRouter)
  .use(indexRouter.commonRouter)
  .use(indexRouter.watchlistRouter)
  .use(indexRouter.watchlistGroupRouter)
  .use(indexRouter.watchlistItemRouter)
  .use(indexRouter.orderRouter)
  .use(indexRouter.alertRouter)
  .use(indexRouter.holdingRouter)
  .use(indexRouter.basketRouter)
  .use(indexRouter.instrumentRouter);

export type App = typeof app;

app.listen(3001, () => console.log(`running at ${config.PORT}`));

export default app;
