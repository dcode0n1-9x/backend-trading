import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { indexRouter } from "./routes/index";
import openapi from "@elysiajs/openapi";
import { config } from "./config/generalconfig";
import { initializeKafka } from "./config/kafka/kafka.config";
import { prisma } from "./db";
// import prometheusPlugin from 'elysia-prometheus'



let cachedStatus = { ok: true, lastCheck: Date.now() };

setInterval(async () => {
  try {
    await prisma.user.findFirst({ select: { id: true } });
    cachedStatus = { ok: true, lastCheck: Date.now() };
  } catch (err: any) {
    cachedStatus = { ok: false, lastCheck: Date.now() };
  }
}, 100_00); // every 10 seconds

const app = new Elysia({
  normalize: true,
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
  // .onStart(async () => {
  //   await initializeKafka()
  // })
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
      origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173",
        "http://localhost:5174"
      ],
      credentials: true,
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
  .get("/health", "OK", {
    detail: {
      tags: ["Health Check"],
      summary: "Health Check Endpoint",
      description: "Health check endpoint to verify server status"
    }
  })
  .get("/ready", () => cachedStatus)
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
  .use(indexRouter.basketItemRouter)
  .use(indexRouter.instrumentRouter)
  .use(indexRouter.gttOrderRouter)
  .listen({ port: config.PORT || 3000 }, () => {
    console.log(`🚀 Server started at http${config.BUN_ENV === 'production' ? 's' : ''}://${config.HOSTNAME || 'localhost'}:${config.PORT || 3000}/api in ${config.BUN_ENV} mode`)
  });

export type AppType = typeof app;

