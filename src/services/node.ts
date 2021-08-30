import { request } from '../utils/request';
import { BasicApiParams } from '~/utils/types';
import { NodeOperate } from '~/pages/about/nodes/_config';

/**
 * 获取节点的列表
 */
export async function getNodeList(params: BasicApiParams) {
  return request(`/network/${params.networkName}/nodes/listNodes`);
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
  peerNameAlias: string;
  serverName?: string;
};
export async function createNode(params: CreateNodeApiParams) {
  return request(`/network/${params.networkName}/nodes/createNode`, { method: 'POST', body: params });
}

export type NodeOperationApiParams = {
  networkName: string;
  orgName: string;
  peerNames: String[];
  operate: NodeOperate;
}
export async function nodeOperateApi(params: NodeOperationApiParams) {
  return request(`/network/${params.networkName}/nodes/nodeOperation`, { method: 'POST', body: params });
}
