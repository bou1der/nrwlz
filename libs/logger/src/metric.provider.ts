import { Injectable } from "@nestjs/common";
import { Histogram, Counter, collectDefaultMetrics, register } from "prom-client"

@Injectable()
export class MetricProvider {

  private httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status', 'service'],
    buckets: [0.1, 0.5, 1, 2, 5], // Бакеты для длительности
  });

  private errorCounter = new Counter({
    name: "error_counter",
    help: "Error counter",
    labelNames: ['method', 'route', 'status'],
  })

  public async init() {
    collectDefaultMetrics()
  }

  public observeRequest(method: string, route: string, status: number, duration: number) {
    this.httpRequestDuration
      .labels({
        method,
        route,
        status,
        service: "api"
        // service: "api",
      })
      .observe(duration / 1000);
    if (status >= 400) {
      this.errorCounter.labels({ method, route, status }).inc();
    }
  }

  public async getMetrics() {
    return await register.metrics()
  }
}

