import { request } from '../utils/request';

/**
 * 创建组织
 */
export async function createOrg(params) {
  return request(`/network/${params.networkName}/orgs/createOrg`, { method: 'POST', body: params });
}

/**
 * 查询组织列表
 */
export async function getOrgList(params) {
  return request(`/network/${params.networkName}/orgs/listOrgs`);
}

/**
 * 查询使用中的组织列表
 */
export async function getOrgInUseList(params) {
  return request(`/network/${params.networkName}/orgs/listOrgsInUse`);
}
