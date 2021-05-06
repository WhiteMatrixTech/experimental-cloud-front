import { request } from '../utils/request';

/**
 * 获取网络信息
 */
export async function getNetworkInfo(params) {
  return request(`/network/${params.networkName}/status`);
};

/**
 * 创建网络
 */
export async function createNetwork(params) {
  return request(`/network/${params.networkName}/createNetwork`, { method: 'POST', body: params });
};

/**
 * 删除网络
 */
export async function deleteNetwork(params) {
  return request(`/deleteNetwork`);
};

