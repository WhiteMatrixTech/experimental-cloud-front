import { request } from '../utils/request';


/**
 *
 * @param 根据路径获取hash
 * @returns
 */
export async function getPathHash(params: any) {
  return request(`/network/${params.networkName}/ipfs/stat?path=${params.path}`, { method: 'POST' });
}

export async function rename(params: any) {
  return request(`/network/${params.networkName}/ipfs/mv?from=${params.from}&to=${params.to}`, { method: 'POST', });
}

export async function delateFile(params: any) {
  return request(`/network/${params.networkName}/ipfs/rm`, { method: 'POST', body: params });
}

export async function downloadFile(params: any) {
  return request(`/network/${params.networkName}/ipfs/download?path=${params.path}&name=${params.name}`);
}


export async function uploadFile(params: any) {
  return request(`/network/${params.networkName}/ipfs/add`, { method: 'POST', body: params });
}

export async function newFolder(params: any) {
  return request(`/network/${params.networkName}/ipfs/mkdir?path=${params.path}`, { method: 'POST' });
}

export async function getIpfsList(params: any) {
  return request(`/network/${params.networkName}/ipfs/listFile/?cid=${params.cid}`, { method: 'POST' });
}
