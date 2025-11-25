export * from "./logger.interceptor";
export * from "./logger.provider";
export * from "./metric.provider";

import { Global, Module } from "@nestjs/common";
import { MetricProvider } from "./metric.provider";
import { HttpAdapterHost } from "@nestjs/core";
import { IncomingMessage, ServerResponse } from "node:http";
import { register } from "prom-client";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Logger } from "./logger.provider";


@Global()
@Module({
  imports: [
    ConfigModule
  ],
  providers: [
    MetricProvider,
    ConfigService,
    Logger,
  ],
  exports: [
    MetricProvider,
    Logger,
  ],
})
export class LoggerModule {
  constructor(
    private readonly metric: MetricProvider,
    private readonly adapter: HttpAdapterHost,
    readonly env: ConfigService,
  ) {
    this.adapter.httpAdapter.get("/metrics", async (req: IncomingMessage, res: ServerResponse) => {
      console.log("REQUEST METRIC")
      if (env.get("NODE_ENV") !== "development") {
        const secret = env.getOrThrow("PROMETHEUS_KEY")
        const apiKey = req.headers["authorization"]?.split(" ")[1]
        if (apiKey !== secret) {
          res.statusCode = 401
          res.end("Unauthorized")
          return
        }
      }
      res.setHeader("Content-Type", register.contentType);
      res.end(await this.metric.getMetrics())
    })
  }
}
