import { BasicApiParams } from '~/utils/types';
import { request } from '../utils/request';

/**
 * 创建组织
 */
export type CreateOrgApiParams = {
  networkName: string;
  channelId: string;
  orgName: string;
  orgNameAlias: string;
  initPeerName: string;
  initPeerAliasName: string;
  serverName?: string;
};
export async function createOrg(params: CreateOrgApiParams) {
  return request(`/network/${params.networkName}/orgs`, { method: 'POST', body: params });
}

/**
 * 查询组织列表
 */
export async function getOrgList(params: BasicApiParams) {
  return request(`/network/${params.networkName}/orgs`);
}

/**
 * 查询使用中的组织列表
 */
export async function getOrgInUseList(params: BasicApiParams) {
  return request(`/network/${params.networkName}/orgs`, { method: 'GET', body: { inUse: true } });
}
