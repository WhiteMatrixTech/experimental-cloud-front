import { request } from 'utils/request';

/**
 * 查询组织列表
 */
export async function getOrgList(params) {
  return request(`/organizations/list/${params.networkVersion}`, { method: 'POST', body: params });
}
/**
 * 获取组织的totalDocs
 */
export async function getOrgTotalDocs() {
  return request(`/organizations/totalCount`);
}
