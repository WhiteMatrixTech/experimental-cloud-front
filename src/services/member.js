import { request } from 'utils/request';
import { stringify } from 'qs';
/**
 * 查询成员列表
 */
export async function getPageListOfCompanyMember(params) {
  return request(`network/${params.networkName}/enterprises/query`, { method: 'POST', body: params });
}
/**
 * 查询成员列表totalCount
 */
export async function getMemberTotalDocs(params) {
  return request(`network/${params.networkName}/enterprises/totalCount`, { method: 'POST', body: params });
}

/**
 * 查询成员详情
 */
export async function getMemberDetail(params) {
  return request(`network/${params.networkName}/enterprises/${params.did}?${stringify(params)}`);
}

/**
 * 审批成员企业
 */
export async function setCompanyApprove(params) {
  return request(`network/${params.networkName}/enterprises/approve`, { method: 'POST', body: params });
}

/**
 * 停用 & 启用 成员企业
 */
export async function setStatusOfLeagueConpany(params) {
  return request(`network/${params.networkName}/enterprises/validate`, { method: 'POST', body: params });
}
