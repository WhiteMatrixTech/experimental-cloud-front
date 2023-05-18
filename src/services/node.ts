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

/**
 * 启动节点
 */
export async function startNode(params: { network: string, orgName: string, nodeName: string }) {
  return request(`/network/${params.network}/nodes/${params.orgName}/${params.nodeName}/start`, { method: 'POST' })
}

/**
 * 停止节点
 */
 export async function stopNode(params: { network: string, orgName: string, nodeName: string }) {
  return request(`/network/${params.network}/nodes/${params.orgName}/${params.nodeName}/stop`, { method: 'POST' })
}
