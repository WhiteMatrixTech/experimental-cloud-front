import { request } from 'utils/request';
import { stringify } from 'qs';

/**
 * 查询成员列表
 */
export async function getPageListOfCompanyMember(params) {
  return request(`/enterprises/query`, { method: 'POST', body: params });
};

/**
 * 查询成员详情
 */
export async function getMemberDetail(params) {
  return request(`/enterprises/${params.companyId}?${stringify(params)}`);
};

/**
 * 审批成员企业
 */
export async function setCompanyApprove(params) {
  return request(`/enterprises/approve`, { method: 'POST', body: params });
};

/**
 * 停用 & 启用 成员企业
 */
export async function setStatusOfLeagueConpany(params) {
  return request(`/enterprises/valid`, { method: 'POST', body: params });
};
