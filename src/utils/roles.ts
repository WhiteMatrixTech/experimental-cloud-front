export enum Roles {
  SUPER = 'SUPER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  USER = 'USER'
}

export const RolesMapNames = {
  [Roles.SUPER]: '超级管理员',
  [Roles.ADMIN]: '网络管理员',
  [Roles.MEMBER]: '网络成员',
  [Roles.USER]: '普通用户' // 未被授权加入组织
};
