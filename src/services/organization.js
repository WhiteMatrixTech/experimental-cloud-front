import { request } from 'utils/request';
import { stringify } from 'qs';

/**
 * 查询组织列表
 */
export async function getOrgList(params) {
  return request(`organizations/list/${params.networkVersion}?${stringify(params)}`);
};

