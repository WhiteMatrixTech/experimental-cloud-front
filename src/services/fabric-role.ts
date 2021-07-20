import { FabricRole } from '~/pages/about/fabricUsers/_config';
import { BasicApiParams } from '~/utils/types';
import { request } from '../utils/request';

/**
 * 获取Fabric用户的列表
 */
export async function getFabricRoleList(params: BasicApiParams) {
  return request(`/network/${params.networkName}/fabricRole/getAll`);
}

/**
 * 获取Fabric用户的列表(合约调用)
 */
export async function getAllUserId(params: BasicApiParams) {
  return request(`/network/${params.networkName}/fabricRole/getAllUserId`);
}

/**
 * 获取某组织下Fabric用户的列表
 */
export async function getFabricRoleListWithOrg(params: { networkName: string; orgName: string }) {
  return request(`/network/${params.networkName}/fabricRole/${params.orgName}/getAll`);
}

/**
 * 新增用户
 */
export type CreateFabricUserApiParams = {
  networkName: string;
  orgName: string;
  userId: string;
  pass: string;
  re_pass: string;
  attrs: string;
  fabricRole: FabricRole;
};
export async function createFabricUser(params: CreateFabricUserApiParams) {
  return request(`/network/${params.networkName}/fabricRole/create`, { method: 'POST', body: params });
}
