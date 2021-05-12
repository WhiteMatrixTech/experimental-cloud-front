import * as API from '../services/block-chain-compile';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';
import { JobStatus } from '@/pages/about/block-compile/package/_config';

export type JobSchema = {
  jobId: string;
  jobName: string;
  status: JobStatus;
  message: string;
}

export type BlockChainCompileModelState = {
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
    getJobList: Effect;
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
    jobList: [],
    jobTotal: 0,
    jobDetail: null,
    jobLog: null
  },

  effects: {
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
