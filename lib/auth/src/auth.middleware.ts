// import { MiddlewareContext, NextFn } from "@nestjs/graphql";
// import { GqlContext } from "./auth.guard";
// import { UserRoleEnum } from "shared/types/user";
// import { ForbiddenError } from "@nestjs/apollo";
// import { AuthSession } from ".";
//
// type GqlMiddlewareContext<S = unknown> = MiddlewareContext<S, GqlContext>;
//
// export const isSignedInMdw = (is_signed_in: boolean) => {
// 	return async ({ context }: GqlMiddlewareContext, next: NextFn) => {
// 		if (context.session?.user && is_signed_in) return await next();
// 		throw new ForbiddenError("Ресурс недоступен");
// 	};
// };
//
// export const hasRoleMdw = (roles: UserRoleEnum[]) => {
// 	return async ({ context }: GqlMiddlewareContext, next: NextFn) => {
// 		if (context.session?.user && roles.includes(context.session.user.role as UserRoleEnum)) return await next();
// 		throw new ForbiddenError("Ресурс недоступен");
// 	};
// };
//
// export function accessMdw<S extends {}>(
// 	compareKey: keyof S,
// 	userKey?: keyof AuthSession<"protected">["user"],
// 	validateFn?: (ctx: GqlMiddlewareContext<S>) => void | Promise<void>,
// ) {
// 	return async ({ context, source, ...ctx }: GqlMiddlewareContext<S>, next: NextFn) => {
// 		if (context.session?.user.role === UserRoleEnum.admin) return await next();
// 		if (
// 			validateFn
// 				? await validateFn({ ...ctx, context, source })
// 				: context.session?.user[userKey || "id"] === source[compareKey]
// 		) {
// 			return await next();
// 		}
// 		throw new ForbiddenError("Ресурс недоступен");
// 	};
// }
