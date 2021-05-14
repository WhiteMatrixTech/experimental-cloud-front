import * as API from '../services/block-chain-compile';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';
import { JobStatus } from '@/pages/about/job-management/_config';

export type GitBuildRepoSchema = {
  gitRepoUrl: string;
  branch: string;
  buildEnvImageName: string;
  buildScript: string;
}

export type GitBuildRepoTask = {
  request: GitBuildRepoSchema;
  buildingJob: JobSchema;
}

export type JobSchema = {
  jobId: string;
  jobName: string;
  status: JobStatus;
  message: Array<string>;
}

export type BlockChainCompileModelState = {
  gitBuildJobList: Array<JobSchema>,
  gitBuildJobTotal: number,
  jobList: Array<JobSchema>,
  jobTotal: number,
  jobDetail: JobSchema | null,
  jobLog: any
}

export type BlockChainCompileModelType = {
  namespace: 'BlockChainCompile';
  state: BlockChainCompileModelState;
  effects: {
    oneKeyCompile: Effect;
    getCompileJobList: Effect;
    getJobList: Effect;
    getJobById: Effect;
    getJobDetail: Effect;
    getJobLog: Effect;
  };
  reducers: {
    common: Reducer<BlockChainCompileModelState>;
  };
};

const BlockChainCompileModel: BlockChainCompileModelType = {
  namespace: 'BlockChainCompile',

  state: {
    gitBuildJobList: [],
    gitBuildJobTotal: 0,
    jobList: [],
    jobTotal: 0,
    jobDetail: null,
    jobLog: null
  },

  effects: {
    *getCompileJobList({ payload }, { call, put }) {
      const res = yield call(API.getCompileJobList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        const gitBuildJob = result.map((task: GitBuildRepoTask) => {
          return {
            ...task,
            ...task.request,
            ...task.buildingJob
          }
        })
        yield put({
          type: 'common',
          payload: {
            gitBuildJobList: gitBuildJob,
            gitBuildJobTotal: gitBuildJob.length,
          },
        });
      }
    },

    *oneKeyCompile({ payload }, { call, put }) {
      const res = yield call(API.oneKeyCompileApi, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: result.message || '一键编译请求发起成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '一键编译请求发起失败', top: 64, duration: 3 });
        return false;
      }
    },

    *getJobList({ payload }, { call, put }) {
      const res = yield call(API.getJobList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            jobList: result,
            jobTotal: result.length,
          },
        });
      }
    },

    *getJobById({ payload }, { call, put }) {
      const res = yield call(API.getJobDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            jobList: [result],
            jobTotal: 1,
          },
        });
      }
    },

    *getJobDetail({ payload }, { call, put }) {
      const res = yield call(API.getJobDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            jobDetail: result,
          },
        });
      }
    },

    *getJobLog({ payload }, { call, put }) {
      const res = yield call(API.getJobLog, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            jobLog: result,
          },
        });
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};

export default BlockChainCompileModel;
