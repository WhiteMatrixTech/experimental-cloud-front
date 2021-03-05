import { request } from '../utils/request';

/**
 * 获取Fabric用户的列表
 */
export async function getFabricRoleList(params) {
  return request(`/network/${params.networkName}/nodes/listNodes`);
}

/**
 * 新增用户
 */
export async function createFabricUser(params) {
  return request(`/network/${params.networkName}/nodes/createNode`, { method: 'POST', body: params });
}
