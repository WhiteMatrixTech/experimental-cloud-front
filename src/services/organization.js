import { request } from 'utils/request';

/**
 * 查询组织列表
 */
export async function getOrgList(params) {
  return request(`/enterprises/query`, { method: 'POST', body: params });
};

