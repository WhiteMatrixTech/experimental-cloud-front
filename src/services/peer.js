import { request } from '../utils/request';

/**
 * 查询组织列表
 */
export async function getOrgList(params) {
  return request(`/network/${params.networkName}/orgs/listOrgs`, { method: 'POST', body: params });
}

/**
 * 获取节点的列表
 */
export async function getPeerList(params) {
  return request(`/network/${params.networkName}/nodes/listNodes`, { method: 'POST', body: params });
}

/**
 * 创建节点
 */
export async function createPeer(params) {
  return request(`/network/${params.networkName}/nodes/createNode`, { method: 'POST', body: params });
}
