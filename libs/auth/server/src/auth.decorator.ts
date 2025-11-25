import { applyDecorators, HttpStatus, SetMetadata, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { IRequest, AuthGuardMetadata } from "./auth.guard";
import { UserRoleEnum } from "@lrp/shared/types/user"
import { HttpError } from "@lrp/shared/types/error"
import type { Session } from ".";

export interface AuthDecoratorOptions {
  declare?: boolean;
}

export const isSignedIn = (arg: boolean, options: AuthDecoratorOptions | undefined = {
  declare: true,
}) => {
  const decorators: (ClassDecorator | MethodDecorator | PropertyDecorator)[] = [
    SetMetadata(AuthGuardMetadata.IS_SIGNED_IN, arg),
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

export const hasRole = (roles: UserRoleEnum[], options: AuthDecoratorOptions | undefined = {
  declare: true,
}) => {
  const decorators: (ClassDecorator | MethodDecorator | PropertyDecorator)[] = [
    SetMetadata(AuthGuardMetadata.HAS_ROLE, roles),
  ];

  if (options?.declare) {
    decorators.push(ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: `Forbidden: User access level: [${roles.join(", ")}]`,
      type: HttpError,
    }));
  }

  return applyDecorators(
    ...decorators
  );
}

export const GetSession = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  let session: Session<null> | Session = {
    user: null,
    session: null
  };

  switch (ctx.getType()) {
    // case "graphql": {
    //   const gql = GqlExecutionContext.create(ctx);
    //   session = gql.getContext<GqlContext>().session;
    //   break;
    // }
    default: {
      session = ctx.switchToHttp().getRequest<IRequest>().session
      break;
    }
  }
  return session;
});
