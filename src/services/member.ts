import { request } from '../utils/request';
import { AllPaginationParams, BasicApiParams } from '~/utils/types';
import { MemberApprovalStatus } from '~/pages/about/member/_config';
/**
 * 查询成员列表
 */
export type GetMemberListByConditionalQueryParams = {
  email: string;
  applicationTimeStart: number;
  applicationTimeEnd: number;
  approvalStatus: MemberApprovalStatus;
};
export async function getMemberList(
  params: BasicApiParams & AllPaginationParams & GetMemberListByConditionalQueryParams
) {
  return request(`/network/${params.networkName}/member/query`, { method: 'POST', body: params });
}
/**
 * 查询成员列表totalCount
 */
export async function getMemberTotal(params: BasicApiParams) {
  return request(`/network/${params.networkName}/member/totalCount`, { method: 'POST', body: params });
}

/**
 * 查询成员详情
 */
export async function getMemberDetail(params: any) {
  return request(`/network/${params.networkName}/member/queryDetail`, { method: 'POST', body: params });
}

/**
 * 审批用户
 */
export async function approveMember(params: any) {
  return request(`/network/${params.networkName}/member/approve`, { method: 'POST', body: params });
}

/**
 * 停用 & 启用 用户
 */
export async function validateMember(params: any) {
  return request(`/network/${params.networkName}/member/validate`, { method: 'POST', body: params });
}

/**
 * 配置已有角色的访问策略给用户
 */
export async function configUserRole(params: any) {
  return request(`/network/${params.networkName}/member/configUserRole`, { method: 'POST', body: params });
}
