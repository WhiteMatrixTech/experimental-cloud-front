import * as API from '../services/block-chain-compile';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';
import { JobCategory, JobStatus } from '~/pages/common/job-management/_config';
import { ConnectState } from './connect';

export type PublishImageCredential = {
  username: string;
  password: string;
  registryServer: string;
};

export interface GitBuildRepoSchema {
  gitRepoUrl: string;
  branch: string;
  buildEnvImage: string;
  buildCommands: string[];
  credential: PublishImageCredential;
}

export interface GitBuildRepoTask extends GitBuildRepoSchema {
  buildJobId: string;
  buildJobStatus: JobStatus;
}

export type JobSchema = {
  jobId: string;
  jobName: string;
  jobCategory: JobCategory;
  status: JobStatus;
  message: Array<string>;
  additionalInfo: {
    [key: string]: any;
  };
};

export type BlockChainCompileModelState = {
  gitBuildJobList: Array<GitBuildRepoTask>;
  gitBuildJobTotal: number;
  jobList: Array<JobSchema>;
  jobTotal: number;
  jobLog: any;
  compileContinueData: string;
  jobContinueData: string;
};

export type BlockChainCompileModelType = {
  namespace: 'BlockChainCompile';
  state: BlockChainCompileModelState;
  effects: {
    oneKeyCompile: Effect;
    getCompileJobList: Effect;
    getJobList: Effect;
    getJobLog: Effect;
  };
  reducers: {
    common: Reducer<BlockChainCompileModelState>;
    cleanJob: Reducer<BlockChainCompileModelState>;
  };
};

const BlockChainCompileModel: BlockChainCompileModelType = {
  namespace: 'BlockChainCompile',

  state: {
    gitBuildJobList: [],
    gitBuildJobTotal: 0,
    jobList: [],
    jobTotal: 0,
    jobLog: null,
    compileContinueData: '',
    jobContinueData: ''
  },

  effects: {
    *getCompileJobList({ payload }, { call, put, select }) {
      const res = yield call(API.getCompileJobList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        const { gitBuildJobList } = yield select((state: ConnectState) => state.BlockChainCompile);
        const newList = gitBuildJobList.concat(result.buildRepoTasks);
        yield put({
          type: 'common',
          payload: {
            gitBuildJobList: newList,
            gitBuildJobTotal: newList.length,
            compileContinueData: result.continueData || ''
          }
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

    *getJobList({ payload }, { call, put, select }) {
      const res = yield call(API.getJobList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        const { jobList } = yield select((state: ConnectState) => state.BlockChainCompile);
        const newList = jobList.concat(result.jobs);
        yield put({
          type: 'common',
          payload: {
            jobList: newList,
            jobTotal: newList.length,
            jobContinueData: result.continueData || ''
          }
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
            jobLog: result
          }
        });
      }
    }
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
    cleanJob(state, action) {
      return {
        ...state,
        ...action.payload,
        gitBuildJobList: [],
        gitBuildJobTotal: 0,
        compileContinueData: '',
        jobList: [],
        jobTotal: 0,
        jobContinueData: ''
      };
    }
  }
};

export default BlockChainCompileModel;
