import { AllPaginationParams } from '~/utils/types';
import { request } from '../utils/request';

/**
 * 获取编译镜像列表
 */
export async function getBuildRecords(params: AllPaginationParams) {
  return request('/images/buildRecords', { method: 'GET', body: params });
}

/**
 * 编译镜像
 */
export async function addBuildRecord(params: any) {
  return request(`/images/build`, { method: 'POST', body: params });
}
