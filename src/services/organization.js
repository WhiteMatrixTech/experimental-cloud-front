import { request } from '../utils/request';

/**
 * 创建组织
 */
export async function createPeerOrg(params) {
  return request(`/network/${params.networkName}/organizations/create`, { method: 'POST', body: params });
}

/**
 * 查询组织列表
 */
export async function getOrgList(params) {
  return request(`/network/${params.networkName}/organizations/list/${params.networkVersion}`, { method: 'POST', body: params });
}

/**
 * 获取组织的totalDocs
 */
export async function getOrgTotalDocs(params) {
  return request(`/network/${params.networkName}/organizations/totalCount`);
}
