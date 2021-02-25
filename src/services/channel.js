import { request } from '../utils/request';

/**
 * 创建通道
 */
export async function createChannel(params) {
  return request(`/network/${params.networkName}/channels/createChannel`, { method: 'POST', body: params });
}

/**
 * 获取 通道列表
 */
export async function getChannelList(params) {
  return request(`/network/${params.networkName}/channels/listChannels`);
}

/**
 * 获取 通道信息
 */
export async function getChannelInfo(params) {
  return request(`/network/${params.networkName}/channels/channelInfo/${params.channelId}`);
}

/**
 * 获取 通道下的组织列表
 */
export async function getOrgListOfChannel(params) {
  return request(`/network/${params.networkName}/orgs/listOrgs/${params.channelId}`);
}

/**
 * 获取 通道下的节点列表
 */
export async function getNodeListOfChannel(params) {
  return request(`/network/${params.networkName}/nodes/listNodes/${params.channelId}`);
}

/**
 * 获取 通道下的合约列表
 */
export async function getContractListOfChannel(params) {
  return request(`/network/${params.networkName}/chainCodes/query`, { method: 'POST', body: params });
}

/**
 * 获取 通道下的合约总数
 */
export async function getContractTotalOfChannel(params) {
  return request(`/network/${params.networkName}/chainCodes/totalCount/${params.channelId}`);
}

/**
 * 获取 通道下的区块列表
 */
export async function getBlockListOfChannel(params) {
  return request(`/network/${params.networkName}/blocks/query`, { method: 'POST', body: params });
}

/**
 * 获取 通道下的区块总数
 */
export async function getBlockTotalOfChannel(params) {
  return request(`/network/${params.networkName}/blocks/totalCount/${params.channelId}`);
}

/**
 * 获取 通道下的交易列表
 */
export async function getTransactionsListOfChannel(params) {
  return request(`/network/${params.networkName}/transactions/query`, { method: 'POST', body: params });
}

/**
 * 获取 通道下的交易总数
 */
export async function getTransactionsTotalOfChannel(params) {
  return request(`/network/${params.networkName}/transactions/totalCount/channel/${params.channelId}`);
}
