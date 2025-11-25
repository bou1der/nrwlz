import { APP_GUARD, HttpAdapterHost } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { toNodeHandler } from "better-auth/node";
import { DynamicModule, FactoryProvider, ForwardReference, Global, InjectionToken, Module, OptionalFactoryDependency, Provider, Type } from "@nestjs/common";
import { AuthService, AuthServiceOptions } from "./auth.service";
import { TelegramSessionProvider } from "./plugins/telegram/provider";

interface AsyncAuthModuleOptions {
  imports?: (Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference<any>)[];
  providers?: Provider[];
  useFactory: FactoryProvider<AuthServiceOptions>["useFactory"],
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}

@Global()
@Module({})
export class AuthModule {

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly authService: AuthService,
  ) {
    const handler = this.authService.client.handler;
    if (handler && this.httpAdapterHost?.httpAdapter) {
      this.httpAdapterHost.httpAdapter.all(
        '/auth/{*any}',
        toNodeHandler(handler),
      );
    }
  }

  static forRootAsync(options: AsyncAuthModuleOptions): DynamicModule {
    return {
      global: true,
      module: AuthModule,
      imports: options.imports,
      providers: [
        ...(options.providers || []),
        {
          inject: options.inject,
          provide: AuthService,
          useFactory: async (...args: Provider[]) => {
            const o = await options.useFactory(...args)
            return new AuthService(o)
          },
        },
        TelegramSessionProvider
      ],
      exports: [
        AuthService,
        TelegramSessionProvider
      ],
    };
  }

  static guard: Provider = {
    provide: APP_GUARD,
    useClass: AuthGuard,
  }

}
