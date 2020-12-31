import { request } from 'utils/request';

// 存证上链
export async function uploadChain(params) {
  return request(`/network/${params.networkName}/evidence/query`, { method: 'POST', body: params });
};

// 查询存证上链列表
export async function getCertificateChainList(params) {
  return request(`/network/${params.networkName}/evidence/query`, { method: 'POST', body: params });
};


// 查询存证上链
export async function getCertificateChain(params) {
  return request(`/network/${params.networkName}/evidence/${params.channelId}/${params.evidenceHash}`);
};
