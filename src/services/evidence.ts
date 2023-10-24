import { request } from '~/utils/request';
import { AllPaginationParams, BasicApiParams } from '~/utils/types';

interface EvidencesOnChainRequest {
  networkName: string;
  channelId: string;
  chainCodeName: string;
  methodName: string;
  params: string[];
  userId: string;
  isInit: boolean;
}

// 数据上链
export async function evidenceOnChain(params: EvidencesOnChainRequest) {
  return request(`/network/${params.networkName}/evidences`, { method: 'POST', body: params });
}

// 查询数据上链列表
export async function getEvidenceDataList(params: BasicApiParams & AllPaginationParams) {
  return request(`/network/${params.networkName}/evidences`, { method: 'GET', body: params });
}

// 点击查看详情
export async function getEvidenceDetail(params: BasicApiParams & { transactionHash: string }) {
  return request(`/network/${params.networkName}/evidences/${params.channelId}/${params.transactionHash}`, {
    method: 'GET',
    body: params,
  });
}

/**
 * 获取存证数据的总数
 */
export async function getEvidenceTotalDocs(params: BasicApiParams) {
  return request(`/network/${params.networkName}/evidences/totalCount`);
}
