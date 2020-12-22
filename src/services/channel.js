import { request } from 'utils/request';
import { stringify } from 'qs';

/**
 * 获取block的totalDocs
 */
export async function getTransactionTotalDocs(params) {
  return request(`network/${params.networkName}/transactions/totalCount`);
}
/**
 * 查询交易列表
 */
export async function getTransactionList(params) {
  return request(`network/${params.networkName}/transactions/query`, { method: 'POST', body: params });
}

/**
 * 查询交易详情
 */
export async function getTransactionDetail(params) {
  return request(`network/${params.networkName}/transactions/${params.Id}?${stringify(params)}`);
}
