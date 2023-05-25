import * as API from '../services/block-chain-compile';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';

type IBuildImageType = "PEER";
export type BuildImageStatus = "WAITING" | "BUILDING" | "SUCCEEDED" | "FAILED";
interface IImageBuildRecord {
  id: number;
  tag: string;
  buildArgs: string[],
  imageType: IBuildImageType[],
  gitRepo: string,
  gitRef: string,
  gitUser: string,
  registryUrl: string,
  registryUser: string,
  jobId: string,
  status: BuildImageStatus[],
  createTime: string;
  updateTime: string;
}

export type BlockChainCompileModelState = {
  buildRecords: Array<IImageBuildRecord>;
  buildRecordsTotal: number;
};

export type BlockChainCompileModelType = {
  namespace: 'BlockChainCompile';
  state: BlockChainCompileModelState;
  effects: {
    getBuildRecords: Effect;
    addBuildRecord: Effect;
  };
  reducers: {
    common: Reducer<BlockChainCompileModelState>;
  };
};

const BlockChainCompileModel: BlockChainCompileModelType = {
  namespace: 'BlockChainCompile',

  state: {
    buildRecords: [],
    buildRecordsTotal: 0
  },

  effects: {
    *getBuildRecords({ payload }, { call, put }):any {
      const res = yield call(API.getBuildRecords, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            buildRecords: result.items,
            buildRecordsTotal: result.total
          }
        });
      }
    },

    *addBuildRecord({ payload }, { call, put }):any {
      const res = yield call(API.addBuildRecord, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: result.message || result.msg || '一键编译请求发起成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || result.msg || '一键编译请求发起失败', top: 64, duration: 3 });
        return false;
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    }
  }
};

export default BlockChainCompileModel;
