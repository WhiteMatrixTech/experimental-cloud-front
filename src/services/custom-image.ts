import { ImageDetail } from '~/models/custom-image';
import { AllPaginationParams } from '~/utils/types';
import { request } from '../utils/request';

//获取镜像列表
export async function getImageList(params: AllPaginationParams) {
  return request('/image/query', { method: 'POST', body: params });
}

//获取镜像列表总数
export async function getImageListTotal() {
  return request('/image/totalCount', { method: 'POST', body: {} });
}

//添加自定义镜像
export async function addCustomImage(params: ImageDetail) {
  return request('/image/create', { method: 'POST', body: params });
}

//删除镜像
export async function deleteCustomImage(params: { imageId: number }) {
  return request(`/image/${params.imageId}`, { method: 'DELETE' });
}
