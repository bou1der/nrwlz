import { APP_GUARD, HttpAdapterHost } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { toNodeHandler } from "better-auth/node";
import { Account, Session, User, Verification } from "./entities";
import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AuthService } from "./auth.service";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Account, Verification, Session]),
    ConfigModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {
  constructor(
    private readonly adapter: HttpAdapterHost,
    private readonly auth: AuthService,
  ) {
    this.adapter.httpAdapter.all("/auth/{*any}", toNodeHandler(this.auth.client.handler));
  }
}
