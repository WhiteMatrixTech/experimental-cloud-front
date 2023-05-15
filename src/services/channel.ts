import { AllPaginationParams, BasicApiParams } from '~/utils/types';
import { request } from '../utils/request';

/**
 * 创建通道
 */
export type CreateChannelApiParams = {
  networkName: string;
  channelName: string; //通道名
  channelNameAlias: string; // 通道别名
  peerOrgNames: string[]; // 组织别名
  description?: string; // 通道描述
};

export async function createChannel(params: CreateChannelApiParams) {
  return request(`/network/${params.networkName}/channels/createChannel`, { method: 'POST', body: params });
}

/**
 * 获取 通道列表
 */
export async function getChannelList(params: BasicApiParams) {
  return request(`/network/${params.networkName}/channels`);
}

/**
 * 获取 通道信息
 */
export async function getChannelInfo(params: BasicApiParams) {
  return request(`/network/${params.networkName}/channels/channelInfo/${params.channelId}`);
}

/**
 * 获取 通道下的组织列表
 */
export async function getOrgListOfChannel(params: BasicApiParams) {
  return request(`/network/${params.networkName}/orgs/listOrgs/${params.channelId}`);
}

/**
 * 为通道添加组织
 */
export async function addOrgForChannel(params: BasicApiParams & { orgName: string }) {
  return request(`/network/${params.networkName}/channels/addOrg`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取 通道下的节点列表
 */
export async function getNodeListOfChannel(params: BasicApiParams) {
  return request(`/network/${params.networkName}/nodes`, { method: 'GET', body: params });
}

/**
 * 获取 通道下的合约列表
 */
export async function getContractListOfChannel(params: BasicApiParams & AllPaginationParams) {
  return request(`/network/${params.networkName}/chainCodes/query`, { method: 'POST', body: params });
}

/**
 * 获取 通道下的合约总数
 */
export async function getContractTotalOfChannel(params: BasicApiParams) {
  return request(`/network/${params.networkName}/chainCodes/totalCount/${params.channelId}`);
}

/**
 * 获取 通道下的区块列表
 */
export async function getBlockListOfChannel(params: BasicApiParams & AllPaginationParams) {
  return request(`/network/${params.networkName}/blocks/query`, { method: 'POST', body: params });
}

/**
 * 获取 通道下的区块总数
 */
export async function getBlockTotalOfChannel(params: BasicApiParams) {
  return request(`/network/${params.networkName}/blocks/totalCount/${params.channelId}`);
}

/**
 * 获取 通道下的交易列表
 */
export async function getTransactionsListOfChannel(params: BasicApiParams & AllPaginationParams) {
  return request(`/network/${params.networkName}/transactions/query`, { method: 'POST', body: params });
}

/**
 * 获取 通道下的交易总数
 */
export async function getTransactionsTotalOfChannel(params: BasicApiParams) {
  return request(`/network/${params.networkName}/transactions/totalCount/channel/${params.channelId}`);
}
