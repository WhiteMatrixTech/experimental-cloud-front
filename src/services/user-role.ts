import { request } from '~/utils/request';
import { BasicPaginationParams } from '~/utils/types';

/**
 * 获取用户列表
 */
export async function getUserList(params: BasicPaginationParams) {
  return request('/super/query', { method: 'POST', body: params });
}
/**
 * 获取用户总数
 */
export async function getUserTotal() {
  return request('/super/countAll', { method: 'GET' });
}

/**
 * 充值用户登录密码
 */
export async function resetPassword(params: { email: string }) {
  return request(`/super/resetPassword`, { method: 'POST', body: params });
}

/**
 * 配置用户为ADMIN角色
 */
export async function setUserAdmin(params: { email: string }) {
  return request(`/super/setAdmin`, { method: 'POST', body: params });
}

/**
 * 移除用户的ADMIN角色
 */
export async function unsetUserAdmin(params: { email: string }) {
  return request(`/super/unsetAdmin`, { method: 'POST', body: params });
}
