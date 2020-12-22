import { request } from 'utils/request';

export async function getOrgList(params) {
  return request(`/organizations/${params.networkVersion}`);
}

export async function getPeerList(params) {
  return request(`/node/list/${params.networkVersion}`, { method: 'POST', body: params });
}

/**
 * 获取节点的totalDocs
 */
export async function getPeerTotalDocs() {
  return request(`/node/totalCount`);
}
/**
 * 获取节点的列表
 */
export async function createPeer(params) {
  return request(`/node/createNewNode`, { method: 'POST', body: params });
}
