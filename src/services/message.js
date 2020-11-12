import { request } from 'utils/request';

/**
 * 查询消息列表
 */
export async function getMessageList(params) {
  return request(`/enterprises/query`, { method: 'POST', body: params });
};

/**
 * 未读消息总数 
 */
export async function getAllUnreadMessage(params) {
  return request(`/enterprises/query`, { method: 'POST', body: params });
};

/**
 * 每类消息下的未读数
 */
export async function getUnreadMesGroup(params) {
  return request(`/enterprises/query`, { method: 'POST', body: params });
};

/**
 * 查询消息详情
 */
export async function getMesDetail(params) {
  return request(`/enterprises/query`, { method: 'POST', body: params });
};

/**
 * 批量已读
 */
export async function bacthReadMes(params) {
  return request(`/enterprises/query`, { method: 'POST', body: params });
};

/**
 * 批量删除
 */
export async function batchDeleteMes(params) {
  return request(`/enterprises/query`, { method: 'POST', body: params });
};
/**
 * 删除消息
 */
export async function deleteMes(params) {
  return request(`/enterprises/query`, { method: 'POST', body: params });
};


