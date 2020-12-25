import { request } from '../utils/request';

export async function getOrgList(params) {
  return request(`/network/${params.networkName}/organizations/${params.networkVersion}`);
}

export async function getPeerList(params) {
  return request(`/network/${params.networkName}/node/list/${params.networkVersion}`, { method: 'POST', body: params });
}

/**
 * 获取节点的totalDocs
 */
export async function getPeerTotalDocs(params) {
  return request(`/network/${params.networkName}/node/totalCount`);
}
/**
 * 获取节点的列表
 */
export async function createPeer(params) {
  return request(`/network/${params.networkName}/node/createNewNode`, { method: 'POST', body: params });
}
