import { UserRoleObject } from '@/models/user-role';
import { request } from '@/utils/request';

/**
 * 获取用户列表
 */
export type PaginationParams = {
  offset: number;
  limit: number
}
export async function getUserList(params: PaginationParams) {
  return request('/superuser/listUsers', { method: 'POST', body: params });
}
/**
 * 获取用户总数
 */
export async function getUserTotal() {
  return request('/superuser/userTotalCount', { method: 'POST', body: {} });
}

/**
 * 获取角色名列表
 */
export async function getRoleNameList() {
  return request('/superuser/listRoleNames', { method: 'POST', body: {} });
}

/**
 * 获取用户角色
 */
export type UserRoleParams = {
  companyName: string;
}
export async function getUserRoles(params: UserRoleParams) {
  return request(`/superuser/customRole/${params.companyName}`);
}

/**
 * 配置用户角色
 */
export async function configUserRoles(params: UserRoleParams & UserRoleObject[]) {
  return request(`/superuser/customRole/${params.companyName}`, { method: 'POST', body: params });
}
