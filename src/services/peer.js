import { request } from '../utils/request';

/**
 * 获取节点的列表
 */
export async function getPeerList(params) {
  return request(`/network/${params.networkName}/nodes/listNodes`);
}

/**
 * 创建节点
 */
export async function createPeer(params) {
  return request(`/network/${params.networkName}/nodes/createNode`, { method: 'POST', body: params });
}
