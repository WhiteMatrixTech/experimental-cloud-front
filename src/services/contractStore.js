import { request } from '../utils/request';

/**
 * 合约仓库 - 合约列表
 */
export async function getRepositoryListOfChainCode(params) {
  return request(`/chainCodeRepository/list`, { method: 'POST', body: params });
}

/**
 * 合约仓库 - 合约详情 - 列表
 */
export async function getStoreSupplyListOfChainCode(params) {
  return request(`/chainCodeRepository/listDetails`, { method: 'POST', body: params });
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
