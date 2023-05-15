import { request } from '../utils/request';
import { BasicApiParams } from '~/utils/types';

/**
 * 获取节点的列表
 */
export async function getNodeList(params: BasicApiParams) {
  return request(`/network/${params.networkName}/nodes`);
}

/**
 * 获取节点 ssh命令
 */
export type GetNodeSSHApiParams = {
  networkName: string;
  orgName: string;
  nodeName: string;
};
export async function getNodeSSH(params: GetNodeSSHApiParams) {
  return request(`/network/${params.networkName}/nodes/getNodeIp`, { method: 'GET', body: params });
}

/**
 * 创建节点
 */
export type CreateNodeApiParams = {
  networkName: string;
  orgName: string;
  peerName: string;
  description?: string;
};
export async function createNode(params: CreateNodeApiParams) {
  return request(`/network/${params.networkName}/nodes`, { method: 'POST', body: params });
}
