import { request } from '../utils/request';
import { AllPaginationParams, BasicApiParams } from '~/utils/types';
import { MemberApprovalStatus } from '~/pages/about/enterprise-member/_config';
/**
 * 查询成员列表
 */
export type GetMemberListByConditionalQueryParams = {
  companyName: string;
  createTimeStart: number;
  createTimeEnd: number;
  approvalStatus: MemberApprovalStatus;
};
export async function getPageListOfCompanyMember(
  params: BasicApiParams & AllPaginationParams & GetMemberListByConditionalQueryParams
) {
  return request(`/network/${params.networkName}/enterprises/query`, { method: 'POST', body: params });
}
/**
 * 查询成员列表totalCount
 */
export async function getMemberTotalDocs(params: BasicApiParams) {
  return request(`/network/${params.networkName}/enterprises/totalCount`, { method: 'POST', body: params });
}

/**
 * 查询成员详情
 */
export async function getMemberDetail(params: any) {
  return request(`/network/${params.networkName}/enterprises/${params.did}`, { method: 'GET', body: params });
}

/**
 * 审批用户
 */
export async function setCompanyApprove(params: any) {
  return request(`/network/${params.networkName}/enterprises/approve`, { method: 'POST', body: params });
}

/**
 * 停用 & 启用 用户
 */
export async function setStatusOfLeagueCompany(params: any) {
  return request(`/network/${params.networkName}/enterprises/validate`, { method: 'POST', body: params });
}

/**
 * 获取某个成员当前使用的角色
 */
export async function getMemberRole(params: any) {
  return request(`/network/${params.networkName}/accessPolicy/user/${params.companyName}`);
}

/**
 * 配置已有角色的访问策略给用户
 */
export async function setRoleToMember(params: any) {
  return request(`/network/${params.networkName}/accessPolicy/configure`, { method: 'POST', body: params });
}

/**
 * 重置成员密码
 */
export async function resetPassword(params: { networkName: string; companyName: string }) {
  return request(`/network/${params.networkName}/enterprises/resetPassword`, { method: 'POST', body: params });
}
