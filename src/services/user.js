import { request } from '../utils/request';

/**
 * 注册
 */
export async function register(params) {
  return request(`/register`, { method: 'POST', body: params });
};

/**
 * 登录
 */
export async function login(params) {
  return request(`/login`, { method: 'POST', body: params });
};

/**
 * 用户信息
 */
export async function getUserInfo(params) {
  return request(`/login/info`);
};

/**
 * 登出
 */
export async function loginout(params) {
  return request(`/logout`);
};

/**
 * 创建网络
 */
export async function createNetwork(params) {
  return request(`/createNetwork`, { method: 'POST', body: params });
};

/**
 * 加入网络
 */
export async function joinNetwork(params) {
  return request(`/addToNetwork`, { method: 'POST', body: params });
};

/**
 * 获取网络列表
 */
export async function getNetworkList(params) {
  return request(`/networkList`);
};

/**
 * 获取我加入的网络列表
 */
export async function getMyNetworkList(params) {
  return request(`/userNetworkList`);
};

