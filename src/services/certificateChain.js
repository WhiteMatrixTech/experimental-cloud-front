import { request } from 'utils/request';
import { stringify } from 'qs';

// 存证上链
export async function uploadChain(params) {
  return request(`/network/${params.networkName}/evidence/create`, {method: 'POST',body: params});
}

// 查询存证上链列表
export async function getCertificateChainList(params) {
  return request(`/network/${params.networkName}/evidence/query`, { method: 'POST', body: params });
}

// 点击查看详情
export async function getcertificateChainDetail(params) {
  return request(`/network/${params.networkName}/evidence/${params.channelId}/${params.evidenceHash}?${stringify( params )}`);
}

/**
 * 获取transadction的totalDocs
 */
export async function getEvidenceTotalDocs(params) {
  return request(`/network/${params.networkName}/evidence/totalCount`);
}

// 查询存证上链
export async function getCertificateChain(params) {
  return request(`/network/${params.networkName}/evidence/${params.channelId}/${params.evidenceHash}`);
}
