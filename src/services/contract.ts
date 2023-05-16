import { request } from '../utils/request';
import { ChainCodeSchema } from 'umi';
import { AllPaginationParams, BasicApiParams } from '~/utils/types';
import { ChainCodeStatus } from '~/pages/about/contract/_config';

/**
 * 创建合约
 */
export async function addContract(params: ChainCodeSchema) {
  return request(`/network/${params.networkName}/chainCodes/create`, { method: 'POST', body: params });
}

/**
 * 审核合约
 */
export async function verifyContract(
  params: BasicApiParams & {
    chainCodeName: string;
    VerifyStatus: ChainCodeStatus;
  }
) {
  return request(`/network/${params.networkName}/chainCodes/verifyChainCode`, { method: 'POST', body: params });
}

/**
 * 安装合约
 */
export async function installContract(params: BasicApiParams) {
  return request(`/network/${params.networkName}/chainCodes/install`, { method: 'POST', body: params });
}

/**
 * 升级合约
 */
export async function upgradeContract(params: ChainCodeSchema) {
  return request(`/network/${params.networkName}/chainCodes/upgrade`, { method: 'POST', body: params });
}

/**
 * 发布合约
 */
export async function releaseContract(params: any) {
  return request(`/network/${params.networkName}/chainCodes/approve`, { method: 'POST', body: params });
}

export interface InvokeChainCodeRequest {
  networkName: string;
  channelId: string;
  chainCodeName: string;
  methodName: string;
  params: string[];
  userId: string;
  isInit: boolean;
}
/**
 * 调用合约--invoke
 */
export async function invokeChainCodeMethod(params: InvokeChainCodeRequest) {
  return request(`/network/${params.networkName}/chainCodes/invokeChainCodeMethod`, { method: 'POST', body: params });
}

/**
 * 调用合约--query
 */
export async function queryChainCodeMethod(params: InvokeChainCodeRequest) {
  return request(`/network/${params.networkName}/chainCodes/queryChainCodeMethod`, { method: 'POST', body: params });
}

/**
 * 使用中的通道列表
 */
export async function getChannelList(params: BasicApiParams) {
  return request(`/network/${params.networkName}/channels`, { method: 'GET', body: { ...params, inUse: true } });
}

/**
 * 当前用户所在通道列表
 */
export async function getChannelListByOrg(params: BasicApiParams) {
  return request(`/network/${params.networkName}/channels`, { method: 'GET', body: { ...params, inUse: true } });
}

/**
 * 检查是否有组织 且组织在使用中
 */
export async function checkOrgInUse(params: BasicApiParams) {
  return request(`/network/${params.networkName}/orgs`, { method: 'GET', body: { inUse: true } });
}

/**
 * 我的合约 - 合约列表
 */
export async function getChainCodeList(params: BasicApiParams & AllPaginationParams) {
  return request(`/network/${params.networkName}/chainCodes/query`, { method: 'POST', body: params });
}

/**
 * 我的合约 - 合约总数
 */
export async function getChainCodeTotal(params: BasicApiParams) {
  return request(`/network/${params.networkName}/chainCodes/totalCount`);
}
