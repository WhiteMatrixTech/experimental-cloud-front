import { RbacRole } from '@/models/rbac';
import { BasicApiParams, BasicPaginationParams } from '@/utils/types';
import { request } from '../utils/request';

/**
 * 获取角色列表
 */
export async function getRoleList(params: BasicApiParams & BasicPaginationParams) {
  return request(`/network/${params.networkName}/accessPolicy/listRoles`, { method: 'POST', body: params });
}

/**
 * 获取角色名列表
 */
export async function getRoleNameList(params: BasicApiParams) {
  return request(`/network/${params.networkName}/accessPolicy/listRoleNames`, { method: 'POST', body: params });
}

/**
 * 获取合约列表
 */
export async function getChaincodeList(params: any) {
  return request(`/network/${params.networkName}/chainCodes/queryAll/${params.companyName}`);
}

/**
 * 获取自己的合约列表
 */
export async function getMyselfChainCodeList(params: any) {
  return request(`/network/${params.networkName}/chainCodes/queryOwn/${params.companyName}`);
}

/**
 * 获取角色的访问策略配置
 */
export async function getRbacConfigWithRole(params: BasicApiParams & { roleName: string }) {
  return request(`/network/${params.networkName}/accessPolicy/${params.roleName}`);
}

/**
 * 添加配置 角色
 */
export async function setConfig(params: RbacRole & { networkName: string }) {
  return request(`/network/${params.networkName}/accessPolicy/create`, { method: 'POST', body: params });
}

/**
 * 输入JSON配置访问策略
 */
export async function setConfigByJson(params: RbacRole & { networkName: string }) {
  return request(`/network/${params.networkName}/accessPolicy/createByJson`, { method: 'POST', body: params });
}
