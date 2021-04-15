import { request } from '../utils/request';

/**
 * 获取公司列表
 */
export async function getCompanyList(params) {
  return request(`/network/${params.networkName}/enterprises/listNames`);
}

/**
 * 获取合约列表
 */
export async function getChaincodeList(params) {
  return request(`/network/${params.networkName}/chainCodes/queryAll`);
}

/**
 * 获取公司的访问策略配置
 */
export async function getRbacConfigWithOrg(params) {
  return request(`/network/${params.networkName}/accessPolicy/${params.companyName}`);
}

/**
 * 配置访问策略
 */
export async function setConfig(params) {
  return request(`/network/${params.networkName}/accessPolicy/create`, { method: 'POST', body: params });
}

/**
 * 重置
 */
export async function resetConfig(params) {
  return request(`/network/${params.networkName}/accessPolicy/reset/${params.companyName}`);
}
