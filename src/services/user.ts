import { BasicApiParams } from '~/utils/types';
import { request } from '../utils/request';

/**
 * 注册
 */
export type RegisterApiParams = {
  email: string;
  pass: string;
  name: string;
  phoneNo: string;
  address: string;
  companyName: string;
  companyCertBusinessNumber?: string;
};
export async function register(params: RegisterApiParams) {
  return request(`/register`, { method: 'POST', body: params });
}

/**
 * 修改密码
 */
export async function changePassword(params: RegisterApiParams) {
  return request(`/user/modifyPassword`, { method: 'POST', body: params });
}

/**
 * 登录
 */
export type LoginApiParams = {
  email: string;
  password: string;
};
export async function login(params: LoginApiParams) {
  return request(`/login`, { method: 'POST', body: params });
}

/**
 * 用户信息
 */
export async function getUserInfo() {
  return request(`/userInfo`);
}

/**
 * 创建联盟
 */
export type CreateLeagueApiParams = {
  networkName: string;
  leagueName: string;
  description: string;
};
export async function createLeague(params: CreateLeagueApiParams) {
  return request(`/createLeague`, { method: 'POST', body: params });
}

/**
 * 加入联盟
 */
export async function enrollInLeague(params: BasicApiParams) {
  return request(`/enrollInLeague`, { method: 'POST', body: params });
}

/**
 * 进入联盟
 */
export async function enterLeague(params: BasicApiParams) {
  return request(`/enterLeague`, { method: 'POST', body: params });
}

/**
 * 获取联盟列表
 */
export async function getNotJointedNetworkList() {
  return request(`/networkNotJoined`);
}

/**
 * 获取我加入的联盟列表
 */
export async function getMyNetworkList() {
  return request(`/userNetworkList`);
}
