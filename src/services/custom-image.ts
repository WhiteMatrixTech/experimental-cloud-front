import { ImageDetail } from '~/models/custom-image';
import { AllPaginationParams } from '~/utils/types';
import { request } from '../utils/request';

//获取镜像列表
export async function getImageList(params: AllPaginationParams) {
  return request('/images', { method: 'GET', body: params });
}

//获取镜像列表总数
export async function getImageListTotal() {
  return request('/images/count', { method: 'GET', body: {} });
}

//添加自定义镜像
export async function addCustomImage(params: ImageDetail) {
  return request('/images', { method: 'POST', body: params });
}

//删除镜像
export async function deleteCustomImage(params: { imageId: number }) {
  return request(`/images/${params.imageId}`, { method: 'DELETE' });
}
