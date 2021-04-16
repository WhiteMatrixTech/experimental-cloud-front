import { request } from '../utils/request';
import { stringify } from 'qs';

/**
 * 创建DID
 */
export async function createDID(params) {
  return request(`/network/${params.networkName}/did`, { method: 'POST', body: params });
}

/**
 * 修改DID
 */
export async function modifyDID(params) {
  return request(`/network/${params.networkName}/did/modify`, { method: 'POST', body: params });
}

/**
 * 删除DID
 */
export async function deleteDID(params) {
  return request(`/network/${params.networkName}/did/delete`, { method: 'POST', body: params });
}

/**
 * 查询DID列表
 */
export async function getDidList(params) {
  const { networkName, ...rest } = params;
  return request(`/network/${networkName}/did?${stringify(rest)}`);
}

/**
 * 查询DID
 */
export async function getDetailByDid(params) {
  return request(`/network/${params.networkName}/did/${params.did}`);
}
