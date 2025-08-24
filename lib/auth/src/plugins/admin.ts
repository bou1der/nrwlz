import { UserRoleEnum } from "@nrwlz/shared/types/user";
import { admin } from "better-auth/plugins";

export const adminPluginConfig = {
  defaultRole: UserRoleEnum.user,
  adminRoles: [UserRoleEnum.admin],
};

export type AdminPlugin = ReturnType<typeof admin<typeof adminPluginConfig>>;
