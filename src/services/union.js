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
  return request(`/network/${params.networkName}/orgs/query`, { method: 'POST', body: params });
};

/**
 * 获取 通道下的节点列表
 */
export async function getPeerListOfUnion(params) {
  return request(`/network/${params.networkName}/nodes/query`, { method: 'POST', body: params });
};

/**
 * 获取 通道下的合约列表
 */
export async function getContractListOfUnion(params) {
  return request(`/network/${params.networkName}/chainCodes/query`, { method: 'POST', body: params });
};

/**
 * 获取 通道下的合约信息汇总
 */
export async function getContractSummaryOfUnion(params) {
  return request(`/network/${params.networkName}/chainCodes/queryDoc`, { method: 'POST', body: params });
};

/**
 * 获取 通道下的区块列表
 */
export async function getBlockListOfUnion(params) {
  return request(`/network/${params.networkName}/blocks/query`, { method: 'POST', body: params });
};

/**
 * 获取 通道下的区块总数
 */
export async function getBlockTotalOfUnion(params) {
  return request(`/network/${params.networkName}/blocks/totalCount/${params.channelId}`);
};

/**
 * 获取 通道下的交易列表
 */
export async function getTransactionsListOfUnion(params) {
  return request(`/network/${params.networkName}/transactions/query`, { method: 'POST', body: params });
};

/**
 * 获取 通道下的交易总数
 */
export async function getTransactionsTotalOfUnion(params) {
  return request(`/network/${params.networkName}/transactions/totalCount/${params.channelId}`);
};
