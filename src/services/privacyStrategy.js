import { request } from '../utils/request';

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
  return request(`/network/${params.networkName}/strategies/${params.strategyName}`);
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

