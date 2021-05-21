import { AllPaginationParams, BasicApiParams } from '~/utils/types';
import { request } from '../utils/request';

/**
 * 获取交易的totalDocs
 */
export async function getTransactionTotalDocs(params: BasicApiParams) {
  return request(`/network/${params.networkName}/transactions/totalCount`);
}
/**
 * 查询交易列表
 */
export async function getTransactionList(params: AllPaginationParams & BasicApiParams) {
  return request(`/network/${params.networkName}/transactions/query`, { method: 'POST', body: params });
}

/**
 * 查询交易详情
 */
export type GetTransactionDetailParams = BasicApiParams & { txId: string };

export async function getTransactionDetail(params: GetTransactionDetailParams) {
  return request(`/network/${params.networkName}/transactions/${params.txId}`);
}
