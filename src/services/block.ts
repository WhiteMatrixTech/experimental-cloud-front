import { request } from '../utils/request';
import { stringify } from 'qs';

/**
 * 获取block的totalDocs
 */
export async function getBlockTotalDocs(params) {
  return request(`/network/${params.networkName}/blocks/totalCount`);
}

/**
 * 交易
 */
export async function getTransactionsTotalDocs(params) {
  return request(`/network/${params.networkName}/transactions/totalCount`);
}

/**
 * 查询区块链列表
 */
export type GetBlockListType = {
  networkName: string;
  channelId: string;
  offset: number;
  limit: number;
  order: 'asc' | 'desc';
  from?: undefined | number | Date;
};
export async function getBlockList(params: GetBlockListType) {
  return request(`/network/${params.networkName}/blocks/query`, { method: 'POST', body: params });
}

/**
 * 查询区块详情
 */
export async function getBlockDetail(params) {
  return request(`/network/${params.networkName}/blocks/${params.blockHash}?${stringify(params)}`);
}

/**
 * 查询交易列表
 */
export async function getTransactionList(params) {
  return request(`/network/${params.networkName}/transactions/queryWithBlockHash`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 根据blockHash查询交易列表totalCount
 */
export async function getTxCountByBlockHash(params) {
  return request(`/network/${params.networkName}/transactions/totalCount/${params.blockHash}`);
}
