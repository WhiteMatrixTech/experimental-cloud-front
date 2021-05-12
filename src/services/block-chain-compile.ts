import { request } from '../utils/request';

/**
 * 一键编译
 */
export async function oneKeyCompileApi(params: any) {
  return request(`/network/${params.networkName}/orgs/createOrg`, { method: 'POST', body: params });
}

/**
 * 创建job
 */
export async function createJob(params: any) {
  return request(`/job/createJob`, { method: 'POST', body: params });
}

/**
 * 查询Job列表
 */
export async function getJobList() {
  return request(`/job`);
}

/**
 * 查询Job详情
 */
export async function getJobDetail(params: { jobId: string }) {
  return request(`/job/${params.jobId}`);
}

/**
 * 查询Job日志
 */
export async function getJobLog(params: { jobId: string }) {
  return request(`/job/${params.jobId}/log`);
}

