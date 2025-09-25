import { applyDecorators, HttpStatus, SetMetadata, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { HAS_ROLE, IS_SIGNED_IN, PubRequest } from "./auth.guard";
import { HttpError, UserRoleEnum } from "@lrp/shared"
import { UserSession } from ".";

export interface AuthDecoratorOptions {
  declare?: boolean;
}

export const isSignedIn = (arg: boolean, options: AuthDecoratorOptions | undefined = { declare: true }) => {
  const decorators: (ClassDecorator | MethodDecorator | PropertyDecorator)[] = [
    SetMetadata(IS_SIGNED_IN, arg),
  ];
  if (arg === true && options?.declare) {
    decorators.push(ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: "Forbidden: User is not authenticated",
      type: HttpError,
    }));
  }
  return applyDecorators(
    ...decorators
  );
}

export const hasRole = (roles: UserRoleEnum[], options: AuthDecoratorOptions | undefined = { declare: true }) =>
  applyDecorators(
    SetMetadata(HAS_ROLE, roles),
    ...(options?.declare
      ? [
        ApiResponse({
          status: HttpStatus.FORBIDDEN,
          description: `Forbidden: User access level: [${roles.join(", ")}]`,
          type: HttpError,
        }),
      ]
      : []),
  );

export const ExtractSession = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  let session: UserSession | null = null;

  switch (ctx.getType()) {
    // case "graphql": {
    //   const gql = GqlExecutionContext.create(ctx);
    //   session = gql.getContext<GqlContext>().session;
    //   break;
    // }
    default: {
      session = ctx.switchToHttp().getRequest<PubRequest>().session;
      break;
    }
  }
  return session;
});
