import { InstancePurpose } from '~/pages/common/elastic-cloud-server/_config';
import { AllPaginationParams } from '~/utils/types';
import { request } from '../utils/request';

/**
 * 获取服务器列表
 */
export async function getServerList(params: AllPaginationParams) {
  return request('/server/query', { method: 'POST', body: params });
}

/**
 * 获取服务器总数
 */
export async function getServerTotal(params: object) {
  return request('/server/totalCount', { method: 'POST', body: params });
}

/**
 * 创建服务器
 */
export type CreateServerApiParams = {
  serverName: string;
  username: string;
  serverPurpose: InstancePurpose;
  publicIp: string;
  privateIp: string;
  publicKey: string;
  privateKey: string;
};
export async function createServer(params: CreateServerApiParams) {
  return request('/server/create', { method: 'POST', body: params });
}

/**
 * 修改服务器
 */
export async function modifyServer(params: CreateServerApiParams) {
  const { serverName, ...rest } = params;
  return request(`/server/${serverName}`, { method: 'POST', body: rest });
}

/**
 * 删除服务器
 */
export async function deleteServer(params: { serverName: string }) {
  return request(`/server/${params.serverName}`, { method: 'DELETE', body: params });
}

/**
 * 获取服务器资源使用情况-节点列表
 */
export async function getNodeList(params: AllPaginationParams & { serverName: string }) {
  return request(`/server/${params.serverName}/query`, { method: 'POST', body: params });
}

/**
 * 获取服务器资源使用情况-节点总数
 */
export async function getNodeTotal(params: { serverName: string }) {
  return request(`/server/${params.serverName}/totalCount`, { method: 'POST', body: params });
}
