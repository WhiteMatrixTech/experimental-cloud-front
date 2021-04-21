import { request } from '../utils/request';
import { stringify } from 'qs';

/**
 * 创建合约
 */
export async function addContract(params) {
  return request(`/network/${params.networkName}/chainCodes/create`, { method: 'POST', body: params });
}

/**
 * 审核合约
 */
export async function verifyContract(params) {
  return request(`/network/${params.networkName}/chainCodes/verifyChainCode`, { method: 'POST', body: params });
}

/**
 * 安装合约
 */
export async function installContract(params) {
  return request(`/network/${params.networkName}/chainCodes/install`, { method: 'POST', body: params });
}

/**
 * 升级合约
 */
export async function upgradeContract(params) {
  return request(`/network/${params.networkName}/chainCodes/upgrade`, { method: 'POST', body: params });
}

/**
 * 发布合约
 */
export async function releaseContract(params) {
  return request(`/network/${params.networkName}/chainCodes/approve`, { method: 'POST', body: params });
}

/**
 * 调用合约--invoke
 */
export async function invokeChainCodeMethod(params) {
  return request(`/network/${params.networkName}/chainCodes/invokeChainCodeMethod`, { method: 'POST', body: params });
}

/**
 * 调用合约--query
 */
export async function queryChainCodeMethod(params) {
  return request(`/network/${params.networkName}/chainCodes/queryChainCodeMethod`, { method: 'POST', body: params });
}

/**
 * 使用中的通道列表
 */
export async function getChannelList(params) {
  return request(`/network/${params.networkName}/channels/listChannelsInUse`);
}

/**
 * 当前用户所在通道列表
 */
export async function getChannelListByOrg(params) {
  return request(`/network/${params.networkName}/channels/listChannelsOfOrg`);
}

/**
 * 检查是否有组织 且组织在使用中
 */
export async function checkOrgInUse(params) {
  return request(`/network/${params.networkName}/orgs/checkOrgInUse`, { method: 'POST' });
}

/**
 * 我的合约 - 合约列表
 */
export async function getChainCodeList(params) {
  return request(`/network/${params.networkName}/chainCodes/query`, { method: 'POST', body: params });
}

/**
 * 我的合约 - 合约总数
 */
export async function getChainCodeTotal(params) {
  return request(`/network/${params.networkName}/chainCodes/totalCount`);
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
