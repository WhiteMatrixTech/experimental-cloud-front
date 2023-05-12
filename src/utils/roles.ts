export enum Roles {
  SUPER = 'SUPER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export const RolesMapNames = {
  [Roles.SUPER]: '超级管理员',
  [Roles.ADMIN]: '系统管理员',
  [Roles.MEMBER]: '普通成员'
};
