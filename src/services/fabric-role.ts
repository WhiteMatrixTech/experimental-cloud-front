import { FabricRole } from '~/pages/about/fabricUsers/_config';
import { BasicApiParams } from '~/utils/types';
import { request } from '../utils/request';

/**
 * 获取Fabric用户的列表
 */
export async function getFabricRoleList(params: BasicApiParams) {
  return request(`/network/${params.networkName}/fabricRoles`);
}

/**
 * 获取Fabric Role对应组织的所有channel
 */
export async function getCurrentRoleChannelList(params: BasicApiParams & { org: string }) {
  return request(`/network/${params.networkName}/channels`, { method: 'GET', body: { isUse: true, org: params.org } });
}


/**
 * 获取可以访问的组织
 */
export async function getMyAccessibleOrgs(params: BasicApiParams) {
  return request(`/network/${params.networkName}/fabricRoles/accessibleOrgs`);
}

/**
 * 获取Fabric用户的角色列表(合约调用)
 */
export async function getAllUserId(params: BasicApiParams) {
  return request(`/network/${params.networkName}/fabricRoles/usernames`);
}

/**
 * 获取某组织下Fabric用户的列表
 */
export async function getFabricRoleListWithOrg(params: { networkName: string; orgName: string }) {
  return request(`/network/${params.networkName}/fabricRoles`, { method: "GET", body: { orgName: params.orgName } });
}

/**
 * 新增用户
 */
export type CreateFabricUserApiParams = {
  networkName: string;
  fabricRole: FabricRole;
  userName: string;
  userSecret: string;
  attrs: string;
};
export async function createFabricUser(params: CreateFabricUserApiParams) {
  return request(`/network/${params.networkName}/fabricRoles`, { method: 'POST', body: params });
}
