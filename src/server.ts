import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { indexRouter } from "./routes/index";
import openapi from "@elysiajs/openapi";
import { config } from "./config/generalconfig";
import { disconnectKafka, initializeKafka } from "./config/kafka/kafka.config";
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
  .onStart(async () => {
    console.log(`🚀 Server started in ${config.BUN_ENV} mode`)
    await initializeKafka();
  })
  // .onStop(async () => {
  //   process.on('SIGTERM', async () => {
  //     console.log('SIGTERM received, shutting down gracefully');
  //     await disconnectKafka();
  //     process.exit(0);
  //   });

  //   process.on('SIGINT', async () => {
  //     console.log('SIGINT received, shutting down gracefully');
  //     await disconnectKafka();
  //     process.exit(0);
  //   });
  //   console.log("🛑 Server stopped")
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
  .get("/health", () => "Working fine", {
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
  .use(indexRouter.basketItemRouter)
  .use(indexRouter.instrumentRouter)
  .use(indexRouter.gttOrderRouter);


export type App = typeof app;

app.listen(config.PORT, () => console.log(`running at ${config.PORT}`));

export default app;
