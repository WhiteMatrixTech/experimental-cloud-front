import { request } from '../utils/request';
import { stringify } from 'qs';

/**
 * 创建合约 || 修改合约
 */
export async function addContract(params) {
  return request(`/network/${params.networkName}/chainCodes/create`, { method: 'POST', body: params });
}

/**
 * 创建合约组织下拉框列表
 */
export async function getSelectListOfOrgPeerChainCode(params) {
  return request(`/api/kbaas-business/org/peer/chain/code/org/select`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 编辑合约 加载合约信息(回显)
 */
export async function getChainCodeLoadInfo(params) {
  return request(`/api/kbaas-business/chain/code/load`, { method: 'POST', body: params });
}
/**
 * 我的合约 - 合约列表
 */
export async function getPageListOfChainCode(params) {
  return request(`/network/${params.networkName}/chainCodes/query`, { method: 'POST', body: params });
}
/**
 * 我的合约 - 合约列表的totalDocs
 */
export async function getPageTotalDocsOfChainCode(params) {
  return request(`/network/${params.networkName}/chainCodes/totalCount`);
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
/**
 * 隐私保护策略列表
 */
export async function getPageListOfRoleData(params) {
  return request(`/network/${params.networkName}/strategies/query`, { method: 'POST', body: params });
}
/**
 * 获取策略列表的totalDocs
 */
export async function getRoleDateTotalDocs(params) {
  return request(`/network/${params.networkName}/strategies/totalCount`);
}
/**
 * 新增隐私保护策略
 */
export async function createAndUpdateStrategy(params) {
  return request(`/network/${params.networkName}/strategies/post`, { method: 'POST', body: params });
}
/**
 *  修改 隐私保护策略
 */
export async function modifyAndUpdateStrategy(params) {
  return request(`/network/${params.networkName}/strategies/update`, { method: 'POST', body: params });
}

/**
 * 启用 停用 隐私保护策略
 */
export async function updateStrategyStatus(params) {
  return request(`/network/${params.networkName}/strategies/updateStatus`, { method: 'POST', body: params });
}

/**
 * 获取策略 关联成员列表
 */
export async function getPageListOfRoleMember(params) {
  return request(`/network/${params.networkName}/strategies/strategyName`, { method: 'POST', body: params });
}

/**
 * 隐私保护策略成员列表关联
 */
export async function updateStrategyMember(params) {
  return request(`/network/${params.networkName}/strategies/updateMember`, { method: 'POST', body: params });
}

/**
 * 隐私保护记录 列表
 */
export async function getPageListOfRecord(params) {
  return request(`/api/kbaas-general/data/role/invoke/record`, { method: 'POST', body: params });
}

/**
 * 合约仓库 - 合约列表
 */
export async function getRepositoryListOfChainCode(params) {
  return request(`/network/${params.networkName}/chainCodeRepository/list`, { method: 'POST', body: params });
}

/**
 * 合约仓库 - 合约详情 - 列表
 */
export async function getStoreSupplyListOfChainCode(params) {
  return request(`/network/${params.networkName}/chainCodeRepository/listDetails`, { method: 'POST', body: params });
}

/**
 * 合约仓库 - 合约详情 - 方法参数说明列表
 */
export async function getStoreSupplyExplainListOfChainCode(params) {
  return request(`/api/kbaas-general/chain/code/repository/fields/list`, {
    method: 'POST',
    body: params,
  });
}
