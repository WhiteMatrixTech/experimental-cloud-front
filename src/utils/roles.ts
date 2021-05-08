export enum Roles {
  SuperUser = 'superuser',
  Admin = 'admin',
  Member = 'member',
  NetworkAdmin = 'networkAdmin',
  NetworkMember = 'networkMember',
  NetworkAssociateMember = 'networkAssociateMember',
}

export const RolesMapNames = {
  [Roles.SuperUser]: '超级管理员',
  [Roles.Admin]: '管理员',
  [Roles.Member]: '普通成员',
  [Roles.NetworkAdmin]: '网络管理员',
  [Roles.NetworkMember]: '网络成员',
  [Roles.NetworkAssociateMember]: '准网络成员',
}