import { ImageDetail } from '~/models/custom-image';
import { BasicApiParams } from '~/utils/types';
import { request } from '../utils/request';

/**
 * 获取网络信息
 */
export async function getNetworkInfo(params: BasicApiParams) {
  return request(`/network/${params.networkName}/status`);
}

/**
 * 创建网络
 */
export type CreateNodeInfo = {
  nodeAliasName: string;
  nodeName: string;
  serverName?: string;
  isAnchor?: boolean;
};
export type CreateNetworkRequest = {
  initOrgAliasName: string;
  initOrgName: string;
  initPeerInfo: CreateNodeInfo[];
  imageInfo?: ImageDetail[];
  companyName?: string;
  networkName?: string;
};
export async function createNetwork(params: CreateNetworkRequest) {
  return request(`/network/${params.networkName}/createNetwork`, { method: 'POST', body: params });
}

/**
 * 删除网络
 */
export async function deleteNetwork() {
  return request(`/deleteNetwork`);
}
