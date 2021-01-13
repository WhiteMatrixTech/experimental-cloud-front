import { request } from '../utils/request';
import { stringify } from 'qs';

/**
 * 创建合约 (后台自动创建--安装)
 */
export async function addContract(params) {
  return request(`/network/${params.networkName}/chainCodes/install`, { method: 'POST', body: params });
}

/**
 * 升级合约 
 */
export async function upgrateContract(params) {
  return request(`/network/${params.networkName}/chainCodes/upgrade`, { method: 'POST', body: params });
}

/**
 * 发布合约
 */
export async function releaseContract(params) {
  return request(`/network/${params.networkName}/chainCodes/approve`, { method: 'POST', body: params });
}

/**
 * 调用合约
 */
export async function invokeContract(params) {
  return request(`/network/${params.networkName}/chainCodes/invoke`, { method: 'POST', body: params });
}

/**
 * 创建合约 通道下拉框列表
 */
export async function getChannelList(params) {
  return request(`/network/${params.networkName}/channels/listChannels`);
}

/**
 * 创建合约 组织下拉框列表
 */
export async function getOrgListWithChannel(params) {
  return request(`/network/${params.networkName}/orgs/listOrgs/${params.channelId}`);
}




/**
 * 我的合约 - 合约列表
 */
export async function getChainCodeList(params) {
  return request(`/network/${params.networkName}/chainCodes/query`, { method: 'POST', body: params });
}

/**
 * 我的合约 -- 通过 / 驳回
 */
export async function setChainCodeApproveReject(params) {
  return request(`/network/${params.networkName}/chainCodes/updateStatus`, { method: 'POST', body: params });
}

/**
 * 我的合约 -- 合约详情
 */
export async function getDetailOfChainCode(params) {
  return request(`/network/${params.networkName}/chainCodes/${params.chainCodeId}?${stringify(params)}`);
}

/**
 * 我的合约 - 合约升级历史
 */
export async function getChainCodeHistory(params) {
  return request(`/network/${params.networkName}/chainCodes/listVersions`, { method: 'POST', body: params });
}

/**
 * 我的合约 - 合约升级历史的totalDocs
 */
export async function getChainCodeHistoryTotalDocs(params) {
  return request(`/network/${params.networkName}/chainCodes/listVersions/totalCount`);
}

/**
 * 我的合约 - 合约审批历史
 */
export async function getChainCodeApprovalHistory(params) {
  return request(`/network/${params.networkName}/chainCodes/listHistory`, { method: 'POST', body: params });
}

/**
 * 我的合约 - 合约审批历史
 */
export async function getChainCodeApprovalHistoryTotalDocs(params) {
  return request(`/network/${params.networkName}/chainCodes/listHistory/totalCount`);
}
