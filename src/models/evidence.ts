import * as API from '../services/evidence';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';

export type EvidenceSchema = {
  transactionHash: string;
  networkName: string;
  channelId: string;
  chaincode: string;
  method: string;
  args: string[];
  responsePayload: string;
  companyName: string;
  createUser: string;
  createdAt: string;
  confirmTime: string;
  synced: boolean;
};

export type EvidenceModelState = {
  evidenceDataList: Array<EvidenceSchema>;
  evidenceDataTotal: number;
  evidenceDataDetail: EvidenceSchema | null;
};

export type EvidenceModelType = {
  namespace: 'Evidence';
  state: EvidenceModelState;
  effects: {
    getEvidenceDataList: Effect;
    getEvidenceDataDetail: Effect;
    getEvidenceTotalDocs: Effect;
    evidenceOnChain: Effect;
  };
  reducers: {
    common: Reducer<EvidenceModelState>;
  };
};

const EvidenceModel: EvidenceModelType = {
  namespace: 'Evidence',

  state: {
    evidenceDataList: [], // 已上链列表
    evidenceDataDetail: null, //存证的详情
    evidenceDataTotal: 0
  },

  effects: {
    *getEvidenceDataList({ payload }, { call, put }): any {
      const res = yield call(API.getEvidenceDataList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            evidenceDataList: result.items || []
          }
        });
      }
    },
    *getEvidenceDataDetail({ payload }, { call, put }): any {
      const res = yield call(API.getEvidenceDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            evidenceDataDetail: result
          }
        });
      }
    },
    *getEvidenceTotalDocs({ payload }, { call, put }): any {
      const res = yield call(API.getEvidenceTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            evidenceDataTotal: result.count
          }
        });
      }
    },
    *evidenceOnChain({ payload }, { call }): any {
      const res = yield call(API.evidenceOnChain, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '上链成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.msg || '上链失败', top: 64, duration: 3 });
        return false;
      }
    }
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    }
  }
};

export default EvidenceModel;
