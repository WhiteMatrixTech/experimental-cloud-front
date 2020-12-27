import { request } from '../utils/request';

/**
 * 获取网络信息
 */
export async function getNetworkInfo(params) {
  return request(`/network/info`);
};

/**
 * 创建网络
 */
export async function createNetwork(params) {
  return request(`/createNetwork`);
};

/**
 * 删除网络
 */
export async function deleteNetwork(params) {
  return request(`/deleteNetwork`);
};

