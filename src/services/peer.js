import { request } from '../utils/request';
import { stringify } from 'qs';

/**
 * 获取节点的列表
 */
export async function getPeerList(params) {
  return request(`/network/${params.networkName}/nodes/listNodes`);
}

/**
 * 获取节点 ssh命令
 */
export async function getPeerSSH(params) {
  return request(`/network/${params.networkName}/nodes/getNodeIp?${stringify(params)}`);
}

/**
 * 创建节点
 */
export async function createPeer(params) {
  return request(`/network/${params.networkName}/nodes/createNode`, { method: 'POST', body: params });
}
