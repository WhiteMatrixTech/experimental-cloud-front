import { request } from '../utils/request';

/**
 * 获取Fabric用户的列表
 */
export async function getFabricRoleList(params) {
  return request(`/network/${params.networkName}/fabricRole/getAll`);
}

/**
 * 获取Fabric用户的列表(合约调用)
 */
export async function getAllUserId(params) {
  return request(`/network/${params.networkName}/fabricRole/getAllUserId`);
}

/**
 * 获取某组织下Fabric用户的列表
 */
export async function getFabricRoleListWithOrg(params) {
  return request(`/network/${params.networkName}/fabricRole/${params.orgName}/getAll`);
}

/**
 * 新增用户
 */
export async function createFabricUser(params) {
  return request(`/network/${params.networkName}/fabricRole/create`, { method: 'POST', body: params });
}
