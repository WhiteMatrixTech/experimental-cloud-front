import { BasicApiParams } from '~/utils/types';
import { request } from '../utils/request';

/**
 * 查询我的联盟信息
 */
export async function getMyLeagueInfo(params: BasicApiParams) {
  return request(`/network/${params.networkName}/info/league`);
}

/**
 * 查询我的用户信息
 */
export async function getMyCompanyInfo(params: BasicApiParams) {
  return request(`/network/${params.networkName}/info/my`);
}

/**
 * 查询我的组织信息
 */
export async function getMyOrgInfo(params: BasicApiParams) {
  return request(`/network/${params.networkName}/info/org`);
}
