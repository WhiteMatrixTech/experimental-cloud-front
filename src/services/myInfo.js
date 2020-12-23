import { request } from 'utils/request';
import { stringify } from 'qs';

/**
 * 查询我的信息详情
 */
export async function getMyInfoDetail(params) {
  return request(`/network/${params.networkName}/enterprises/${params.companyId}?${stringify(params)}`);
};

