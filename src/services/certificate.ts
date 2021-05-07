import { request } from '../utils/request';

/**
 * 查询证书列表
 */
export async function getCertificateList(params: any) {
  return request(`/network/${params.networkName}/enterprises/query`, { method: 'POST', body: params });
};

