import { CanActivate, ExecutionContext, Global } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRoleEnum } from "@lrp/shared";
import { AuthService, UserSession } from "./auth.service";

export interface SafeRequest extends Request {
  session: UserSession;
}
export interface PubRequest extends Request {
  session: UserSession<null>;
}

export const IS_SIGNED_IN = "IS_SIGNED_IN";
export const HAS_ROLE = "HAS_ROLE";

@Global()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const check_signed_id = this.reflector.get<boolean | undefined>(IS_SIGNED_IN, context.getHandler());
    const check_role = this.reflector.get<UserRoleEnum[] | undefined>(HAS_ROLE, context.getHandler());

    if (!check_role && check_signed_id === undefined) return true

    let request: PubRequest | undefined = undefined;
    let headers: Headers | undefined = undefined;

    switch (context.getType()) {
      // case "graphql": {
      //   const ctx = GqlExecutionContext.create(context);
      //   request = ctx.getContext<GqlContext>();
      //   headers = new Headers(request.req.headers as Record<string, string>);
      //   break;
      // }
      default: {
        request = context.switchToHttp().getRequest<PubRequest>();
        headers = request.headers;
        break;
      }
    }
    const session = await this.auth.client.api.getSession({
      headers,
    });

    if (session) request.session = session;

    if (!check_signed_id && !check_role) return true;
    if (session && !check_role && check_signed_id) return true;
    if (check_role && session && check_role.includes(session.user.role as UserRoleEnum)) return true;

    return false;
  }
}
