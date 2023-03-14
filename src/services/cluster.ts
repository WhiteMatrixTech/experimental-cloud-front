import { AllPaginationParams } from '~/utils/types';
import { request } from '../utils/request';

/**
 * 获取集群列表
 */
export async function getClusterList(params: AllPaginationParams) {
  return request('/clusters', { method: 'GET', body: params });
}

/**
 * 创建集群
 */
export type CreateClusterApiParams = {
  name: string;
  description: string;
  kubeConfig: string;
};
export async function createCluster(params: CreateClusterApiParams) {
  return request('/clusters', { method: 'POST', body: params });
}

export async function modifyCluster(params: CreateClusterApiParams & { id: string }) {
  return request(`/clusters/${params.id}`, { method: 'PUT', body: params });
}

/**
 * 解绑集群
 */
export async function untieCluster(params: { id: string }) {
  return request(`/clusters/${params.id}`, { method: 'DELETE', body: params });
}
