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
  return request(`/userInfo`);
};

/**
 * 登出
 */
export async function loginout(params) {
  return request(`/logout`);
};

/**
 * 创建联盟
 */
export async function createLeague(params) {
  return request(`/createLeague`, { method: 'POST', body: params });
};

/**
 * 加入联盟
 */
export async function enrollInLeague(params) {
  return request(`/enrollInLeague`, { method: 'POST', body: params });
};

/**
 * 进入联盟
 */
export async function enterLeague(params) {
  return request(`/enterLeague`, { method: 'POST', body: params });
};

/**
 * 获取联盟列表
 */
export async function getNetworkList(params) {
  return request(`/networkList`);
};

/**
 * 获取我加入的联盟列表
 */
export async function getMyNetworkList(params) {
  return request(`/userNetworkList`);
};

