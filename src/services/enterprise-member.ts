import { request } from '../utils/request';
import { stringify } from 'qs';
/**
 * 查询成员列表
 */
export async function getPageListOfCompanyMember(params) {
  return request(`/network/${params.networkName}/enterprises/query`, { method: 'POST', body: params });
}
/**
 * 查询成员列表totalCount
 */
export async function getMemberTotalDocs(params) {
  return request(`/network/${params.networkName}/enterprises/totalCount`, { method: 'POST', body: params });
}

/**
 * 查询成员详情
 */
export async function getMemberDetail(params) {
  return request(`/network/${params.networkName}/enterprises/${params.did}?${stringify(params)}`);
}

/**
 * 审批用户
 */
export async function setCompanyApprove(params) {
  return request(`/network/${params.networkName}/enterprises/approve`, { method: 'POST', body: params });
}

/**
 * 停用 & 启用 用户
 */
export async function setStatusOfLeagueCompany(params) {
  return request(`/network/${params.networkName}/enterprises/validate`, { method: 'POST', body: params });
}

/**
 * 获取某个成员当前使用的角色
 */
export async function getMemberRole(params) {
  return request(`/network/${params.networkName}/accessPolicy/user/${params.companyName}`);
}

/**
 * 配置已有角色的访问策略给用户
 */
export async function setRoleToMember(params) {
  return request(`/network/${params.networkName}/accessPolicy/configure`, { method: 'POST', body: params });
}