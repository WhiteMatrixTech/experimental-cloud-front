import { request } from 'utils/request';
import { stringify } from 'qs';

/**
 * 查询交易列表
 */
export async function getTransactionList(params) {
  return request(`/transactions/list`, { method: 'POST', body: params });
};

/**
 * 查询交易详情
 */
export async function getTransactionDetail(params) {
  return request(`/transactions/${params.Id}?${stringify(params)}`);
};
