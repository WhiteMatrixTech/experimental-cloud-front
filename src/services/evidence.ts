import { request } from 'utils/request';
import { stringify } from 'qs';

// 存证上链
export async function evidenceOnChain(params) {
  return request(`/network/${params.networkName}/evidence/create`, { method: 'POST', body: params });
}

// 查询存证上链列表
export async function getEvidenceDataList(params) {
  return request(`/network/${params.networkName}/evidence/query`, { method: 'POST', body: params });
}

// 根据存证哈希查询存证上链数据
export async function getEvidenceDataByHash(params) {
  return request(`/network/${params.networkName}/evidence/query/${params.evidenceHash}`);
}

// 点击查看详情
export async function getEvidenceDetail(params) {
  return request(
    `/network/${params.networkName}/evidence/channel/${params.channelId}/${params.evidenceHash}?${stringify(params)}`,
  );
}

/**
 * 获取存证数据的总数
 */
export async function getEvidenceTotalDocs(params) {
  return request(`/network/${params.networkName}/evidence/totalCount`);
}
