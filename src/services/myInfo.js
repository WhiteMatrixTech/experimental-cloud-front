import { request } from '../utils/request';

/**
 * 查询我的联盟信息
 */
export async function getMyLeagueInfo(params) {
  return request(`/network/${params.networkName}/info/league`);
};

/**
 * 查询我的企业信息
 */
  export async function getMyCompanyInfo(params) {
  return request(`/network/${params.networkName}/info/company`);
};

/**
 * 查询我的组织信息
 */
export async function getMyOrgInfo(params) {
  return request(`/network/${params.networkName}/info/org`);
};

