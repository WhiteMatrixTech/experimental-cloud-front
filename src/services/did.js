import { request } from '../utils/request';
import { stringify } from 'qs';

/**
 * 创建DID
 */
export async function createDID(params) {
  return request(`/network/${params.networkName}/did/create`, { method: 'POST', body: params });
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
  return request(`/network/${params.networkName}/did?${stringify(params)}`);
}

/**
 * 查询DID
 */
export async function getDetailByDid(params) {
  return request(`/network/${params.networkName}/did/${params.did}`);
}
