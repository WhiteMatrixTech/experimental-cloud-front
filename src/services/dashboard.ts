import { BasicApiParams } from '~/utils/types';
import { request } from '../utils/request';

/**
 * 获取网络信息
 */
export async function getNetworkInfo(params: BasicApiParams) {
  return request(`/network/${params.networkName}`);
}

/**
 * 创建网络--默认配置
 */
export type CreateDefaultNetworkRequest = {
  cluster: string;
  network: string;
  orgName: string;
  channel: {
    name: string;
    description: string;
  };
};

export async function createNetworkDefault(params: CreateDefaultNetworkRequest) {
  return request(`/network/createDefault`, { method: 'POST', body: params });
}

/**
 * 创建网络--自定义配置
 */
export type CreateCustomNetworkRequest = {
  cluster: string;
  network: string;
  caCertExpiryTime: string;
  ordererNodeNum: number;
  orgName: string;
  peerNodeImage: string;
  peerNodeImageVersion: string;
  nodeAddMode: 'NORMAL" | "BATCH ';
  nodeList: Array<{
    name: string;
    description?: string;
  }>;
  nodeNamePrefix: string;
  nodeDescription: string;
  nodeNum: number;
  channel: {
    name: string;
    description: string;
    consensusMechanism: 'etcdraft' | 'solo';
    endorsementPolicy: string;
    maxMessageCount: number; // 1 ~ 500
    batchTimeout: string;
  };
};

export async function createNetworkCustom(params: CreateCustomNetworkRequest) {
  return request(`/network/createCustom`, { method: 'POST', body: params });
}

export async function stopNetwork(params: { networkName: string }) {
  return request(`/network/${params.networkName}/stopOrRestart`, { method: 'GET', body: params });
}

export async function restartNetwork(params: { networkName: string }) {
  return request(`/network/${params.networkName}/stopOrRestart`, { method: 'GET', body: params });
}

/**
 * 删除网络
 */
export async function deleteNetwork(params: { networkName: string }) {
  return request(`/network/${params.networkName}/delete`, { method: 'DELETE', body: params });
}
