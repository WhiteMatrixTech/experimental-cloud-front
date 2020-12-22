import { request } from 'utils/request';
import { stringify } from 'qs';

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
 * 登出
 */
export async function loginout(params) {
  return request(`/login`, { method: 'POST', body: params });
};

