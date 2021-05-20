import { request } from '@/utils/request';
import { AllPaginationParams, BasicApiParams } from '@/utils/types';

// 存证上链
export async function evidenceOnChain(params: BasicApiParams & { evidenceData: string }) {
  return request(`/network/${params.networkName}/evidence/create`, { method: 'POST', body: params });
}

// 查询存证上链列表
export async function getEvidenceDataList(params: BasicApiParams & AllPaginationParams) {
  return request(`/network/${params.networkName}/evidence/query`, { method: 'POST', body: params });
}

// 根据存证哈希查询存证上链数据
export async function getEvidenceDataByHash(params: { networkName: string; evidenceHash: string }) {
  return request(`/network/${params.networkName}/evidence/query/${params.evidenceHash}`);
}

// 点击查看详情
export async function getEvidenceDetail(params: BasicApiParams & { evidenceHash: string }) {
  return request(`/network/${params.networkName}/evidence/channel/${params.channelId}/${params.evidenceHash}`, {
    method: 'GET',
    body: params,
  });
}

/**
 * 获取存证数据的总数
 */
export async function getEvidenceTotalDocs(params: BasicApiParams) {
  return request(`/network/${params.networkName}/evidence/totalCount`);
}
