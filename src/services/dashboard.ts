import { ImageDetail } from '~/models/dashboard';
import { AllPaginationParams, BasicApiParams } from '~/utils/types';
import { request } from '../utils/request';

/**
 * 获取镜像列表
 */
export async function getImageList(params: AllPaginationParams) {
  return request('/image/query', { method: 'POST', body: params });
}

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
