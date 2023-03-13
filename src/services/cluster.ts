import { AllPaginationParams } from '~/utils/types';
import { request } from '../utils/request';

/**
 * 获取集群列表
 */
export async function getClusterList(params: AllPaginationParams) {
  return request('/cluster/query', { method: 'POST', body: params });
}

/**
 * 获取集群总数
 */
export async function getClusterTotal(params: object) {
  return request('/cluster/totalCount', { method: 'POST', body: params });
}

/**
 * 创建集群
 */
export type CreateClusterApiParams = {
  clusterName: string;
  clusterDesc: string;
  kubeConfig: string;
};
export async function createCluster(params: CreateClusterApiParams) {
  return request('/cluster/create', { method: 'POST', body: params });
}

/**
 * 解绑集群
 */
export async function untieCluster(params: { clusterName: string }) {
  return request(`/cluster/${params.clusterName}`, { method: 'DELETE', body: params });
}
