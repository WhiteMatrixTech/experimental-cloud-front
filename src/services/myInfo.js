import { request } from '../utils/request';
import { stringify } from 'qs';

/**
 * 查询我的联盟信息
 */
export async function getMyLeagueInfo(params) {
  return request(`/network/${params.networkName}/enterprises?${stringify(params)}`);
};

/**
 * 查询我的企业信息
 */
export async function getMyCompanyInfo(params) {
  return request(`/network/${params.networkName}/enterprises?${stringify(params)}`);
};

/**
 * 查询我的组织信息
 */
export async function getMyOrgInfo(params) {
  return request(`/network/${params.networkName}/enterprises?${stringify(params)}`);
};

