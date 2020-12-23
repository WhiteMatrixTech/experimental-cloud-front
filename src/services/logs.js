import { request } from 'utils/request';

/**
 * 查询日志列表
 */
export async function getLogsList(params) {
  return request(`/network/${params.networkName}/enterprises/query`, { method: 'POST', body: params });
};

