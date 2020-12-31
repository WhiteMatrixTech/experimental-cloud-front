import { request } from '../utils/request';

/**
 * 创建通道
 */
export async function createChannel(params) {
  return request(`/network/${params.networkName}/channels/createChannel`, { method: 'POST', body: params });
};

/**
 * 获取 通道列表
 */
export async function getUnionList(params) {
  return request(`/network/${params.networkName}/channels/listChannels`);
};

/**
 * 获取 通道下的组织列表
 */
export async function getOrgListOfUnion(params) {
  return request(`/network/${params.networkName}/enterprises/query`, { method: 'POST', body: params });
};

/**
 * 获取 通道下的节点列表
 */
export async function getPeerListOfUnion(params) {
  return request(`/network/${params.networkName}/enterprises/query`, { method: 'POST', body: params });
};

/**
 * 获取 通道下的合约列表
 */
export async function getContractListOfUnion(params) {
  return request(`/network/${params.networkName}/enterprises/query`, { method: 'POST', body: params });
};

/**
 * 获取 通道下的合约信息汇总
 */
export async function getContractSummaryOfUnion(params) {
  return request(`/network/${params.networkName}/enterprises/query`, { method: 'POST', body: params });
};

