import { GitBuildRepoSchema } from 'umi';
import { request } from '../utils/request';

/**
 * 一键编译
 */
export async function oneKeyCompileApi(params: GitBuildRepoSchema) {
  return request(`/build/createBuildRepoTask`, { method: 'POST', body: params });
}

/**
 * 获取编译任务列表
 */
export async function getCompileJobList() {
  return request('/build');
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
 * 查询Job日志
 */
export async function getJobLog(params: { jobId: string }) {
  return request(`/job/${params.jobId}/logs`);
}
