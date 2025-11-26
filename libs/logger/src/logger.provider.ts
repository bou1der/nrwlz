import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, transports, Logger as WinstonLogger, } from 'winston';
import LokiTransport from 'winston-loki'

export type LoggerOptions = {
  mode: "production"
  httpUrl: string,
} | {
  mode: "development"
}
type Transports = typeof transports[keyof Pick<typeof transports, "Http" | "Console" | "File" | "Stream">] | LokiTransport

const transportOptions = {
  console: new transports.Console({
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true, trace: true }),
      format.colorize({
        all: true,
      }),
      format.printf(({ timestamp, level, message, context, stack, trace }) => {
        const stacks = stack
          ? `\n${stack}`
          : '';
        return `${timestamp} [${level}] ${context ? `[${context}] ` : ''}${message} ${stacks} ${trace ? ` \n${trace}` : ''}`
      }),
    ),
  }),
}


@Injectable()
export class Logger implements LoggerService {
  private logger: WinstonLogger;

  constructor(
    @Inject() env: ConfigService
  ) {
    const additionalTransports: Transports[] = [];
    const mode = env.get("NODE_ENV")

    if (mode === "production") {
      additionalTransports.push(
        new LokiTransport({
          host: env.getOrThrow("LOKI_URL"),
          labels: {
            app: "solar-api",
          },
          json: true,
          format: format.json(),
          onConnectionError: (err) => {
            console.error(err);
          },
        })
      )
    }

    this.logger = createLogger({
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true, trace: true }),
        format.json(),
      ),
      transports: [
        transportOptions.console,
        ...additionalTransports,
      ],
      exceptionHandlers: [
        transportOptions.console,
        ...additionalTransports,
      ],
      exitOnError: false,
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }
  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }
  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }
  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }
  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
