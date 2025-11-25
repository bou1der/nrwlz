import { CallHandler, ExecutionContext, HttpException, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { tap } from "rxjs/operators"
import { MetricProvider } from "./metric.provider";
import { Logger } from "./logger.provider";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject() private readonly metric: MetricProvider,
    @Inject() private readonly logger: Logger,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (response) => {
          const duration = Date.now() - now;
          const status = response?.status || 200;
          this.metric.observeRequest(method, url, status, duration);
          this.logger.log(`${method} ${url} (${duration}ms)`, LoggingInterceptor.name)
        },
        error: (error) => {
          const duration = Date.now() - now;
          const status = error instanceof HttpException ? error.getStatus() : 500;
          this.metric.observeRequest(method, url, status, duration);
          if (status >= 400) {
            if (error instanceof HttpException) {
              this.logger.error(error.message, error.stack, LoggingInterceptor.name)
            } else if (error instanceof Error) {
              this.logger.error(error.message, error.stack, error.name)
            }

          }
        }
      })
    );
  }
}

// tap((data) => {
//   const duration = Date.now() - start;
//   console.log(`[${req.method}] ${req.url} (${duration}ms)`, {
//     body: data,
//   });
// }),
