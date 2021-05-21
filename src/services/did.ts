import { request } from '../utils/request';
import { BasicApiParams } from '~/utils/types';

/**
 * 创建DID
 */
export async function createDID(params: BasicApiParams) {
  return request(`/network/${params.networkName}/did`, { method: 'POST', body: params });
}

/**
 * 修改DID
 */
export async function modifyDID(params: BasicApiParams) {
  return request(`/network/${params.networkName}/did/modify`, { method: 'POST', body: params });
}

/**
 * 删除DID
 */
export async function deleteDID(params: { networkName: string; did: string }) {
  return request(`/network/${params.networkName}/did/delete`, { method: 'POST', body: params });
}

/**
 * 查询DID列表
 */
export async function getDidList(params: { networkName: string; paginator: string }) {
  const { networkName, ...rest } = params;
  return request(`/network/${networkName}/did`, { method: 'GET', body: rest });
}

/**
 * 查询DID
 */
export async function getDetailByDid(params: { networkName: string; did: string }) {
  return request(`/network/${params.networkName}/did/${params.did}`);
}
