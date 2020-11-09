import { request } from 'utils/request';
import { stringify } from 'qs';

/**
 * 创建合约 || 修改合约
 */
export async function addContract(params) {
  return request(`/chainCodes/create`, { method: 'POST', body: params });
};

/**
 * 创建合约组织下拉框列表 
 */
export async function getSelectListOfOrgPeerChainCode(params) {
  return request(`/api/kbaas-business/org/peer/chain/code/org/select`, { method: 'POST', body: params });
};

/**
 * 编辑合约 加载合约信息(回显)
 */
export async function getChainCodeLoadInfo(params) {
  return request(`/api/kbaas-business/chain/code/load`, { method: 'POST', body: params });
};
/**
 * 我的合约 - 合约列表
 */
export async function getPageListOfChainCode(params) {
  return request(`/chainCodes/list`, { method: 'POST', body: params });
};

/**
 * 我的合约 -- 通过 / 驳回
 */
export async function setChainCodeApproveReject(params) {
  return request(`/chainCodes/updateStatus`, { method: 'POST', body: params });
};

/**
 * 我的合约 -- 合约详情 
 */
export async function getDetailOfChainCode(params) {
  return request(`/chainCodes/${params.chainCodeId}?${stringify(params)}`);
};

/**
 * 我的合约 - 合约升级历史 
 */
export async function getChainCodeHistory(params) {
  return request(`/chainCodes/listVersions`, { method: 'POST', body: params });
};
/**
 * 我的合约 - 合约审批历史
 */
export async function getChainCodeApprovalHistory(params) {
  return request(`/chainCodes/listHistory`, { method: 'POST', body: params });
};


