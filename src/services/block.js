import { request } from 'utils/request';
import { stringify } from 'qs';

/**
 * 查询区块链列表
 */
export async function getBlockList(params) {
  return request(`/blocks/list`, { method: 'POST', body: params });
};

/**
 * 查询区块详情
 */
export async function getBlockDetail(params) {
  return request(`/blocks/${params.blockHash}?${stringify(params)}`);
};

/**
 * 查询交易列表
 */
export async function getTransactionList(params) {
  return request(`/transactions/list`, { method: 'POST', body: params });
};
