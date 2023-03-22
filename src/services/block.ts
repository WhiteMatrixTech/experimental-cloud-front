import { request } from '../utils/request';
import { AllPaginationParams, BasicApiParams } from '~/utils/types';

/**
 * 获取block的totalDocs
 */
export async function getBlockTotalDocs(params: BasicApiParams) {
  return request(`/network/${params.networkName}/blocks/totalCount`);
}

/**
 * 查询区块链列表
 */
export async function getBlockList(params: BasicApiParams & AllPaginationParams) {
  return request(`/network/${params.networkName}/blocks/query`, { method: 'POST', body: params });
}

export type GetTransactionParams = BasicApiParams & { blockHash: string };

/**
 * 查询区块详情
 */
export async function getBlockDetail(params: GetTransactionParams) {
  return request(`/network/${params.networkName}/blocks/${params.blockHash}`, { method: 'GET', body: params });
}

/**
 * 查询交易列表
 */
export async function getTransactionList(params: GetTransactionParams & AllPaginationParams) {
  return request(`/network/${params.networkName}/transactions/queryWithBlockHash`, {
    method: 'POST',
    body: params
  });
}

/**
 * 根据blockHash查询交易列表totalCount
 */
export async function getTxCountByBlockHash(params: GetTransactionParams) {
  return request(`/network/${params.networkName}/transactions/${params.blockHash}`);
}
