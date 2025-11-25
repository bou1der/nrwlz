import { CanActivate, ExecutionContext, Global } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRoleEnum } from "@lrp/shared/types/user";
import { AuthService, Session } from "./auth.service";
import { Request } from "express";
import { TelegramSessionProvider } from "./plugins/telegram/provider";

export interface IRequest extends Request {
  session: Session;
}

export enum AuthGuardMetadata {
  IS_SIGNED_IN = "IS_SIGNED_IN",
  HAS_ROLE = "HAS_ROLE",
}

@Global()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private readonly reflector: Reflector,
    private readonly telegramSessionProvider: TelegramSessionProvider,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const check_signed_in = this.reflector.get<boolean | undefined>(AuthGuardMetadata.IS_SIGNED_IN, context.getHandler());
    const check_role = this.reflector.get<UserRoleEnum[] | undefined>(AuthGuardMetadata.HAS_ROLE, context.getHandler());


    let request: IRequest | undefined = undefined;
    let headers: Record<string, string | undefined> | undefined = undefined;

    switch (context.getType()) {
      default: {
        request = context.switchToHttp().getRequest<IRequest>();
        headers = request.headers as Record<string, string | undefined>;
        break;
      }
    }

    let session: Session | null = null;

    const authorization = request['headers']["authorization"]?.split(" ")

    switch (authorization?.[0]) {
      case "x-init": {
        const xInitData = authorization?.[1]
        if (!xInitData || typeof xInitData !== "string") break;
        session = await this.telegramSessionProvider.getSessionByInitData(xInitData)
        break;
      }
      case undefined: {
        const newHeaders: Headers = new Headers()
        for (const key of Object.keys(headers)) {
          newHeaders.set(key, headers[key] as string)
        }
        session = await this.auth.client.api.getSession({
          headers: newHeaders,
        })
        break;
      }
    }

    if (session) request.session = session;

    if (!check_role && check_signed_in === undefined) return true

    if (!check_signed_in && !check_role) return true;
    if (session && !check_role && check_signed_in) return true;
    if (check_role && session && check_role.includes(session.user.role as UserRoleEnum)) return true;

    return false;
  }
}
