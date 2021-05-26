import { AllPaginationParams } from '~/utils/types';
import { request } from '../utils/request';

/**
 * 获取镜像列表
 */
export async function getImageList(params: AllPaginationParams) {
  return request('/image/query', { method: 'POST', body: params });
}
