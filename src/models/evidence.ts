import * as API from '../services/evidence';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';

export type EvidenceSchema = {
  evidenceHash: string,
  networkName: string,
  channelId: string,
  evidenceData: string,
  companyName: string,
  createUser: string,
  createdAt: string
}

export type EvidenceModelState = {
  evidenceDataList: Array<EvidenceSchema>,
  evidenceDataTotal: number,
  evidenceDataDetail: EvidenceSchema | object,
}

export type EvidenceModelType = {
  namespace: 'Evidence';
  state: EvidenceModelState;
  effects: {
    getEvidenceDataList: Effect;
    getEvidenceDataByHash: Effect;
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
    evidenceDataList: [], // 已存证上链列表
    evidenceDataDetail: {}, //存证的详情
    evidenceDataTotal: 0,
  },

  effects: {
    *getEvidenceDataList({ payload }, { call, put }) {
      const res = yield call(API.getEvidenceDataList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            evidenceDataList: result.items,
          },
        });
      }
    },
    *getEvidenceDataByHash({ payload }, { call, put }) {
      const res = yield call(API.getEvidenceDataByHash, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            evidenceDataList: result,
            evidenceDataTotal: result.length,
          },
        });
      }
    },
    *getEvidenceDataDetail({ payload }, { call, put }) {
      const res = yield call(API.getEvidenceDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            evidenceDataDetail: result,
          },
        });
      }
    },
    *getEvidenceTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getEvidenceTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            evidenceDataTotal: result.count,
          },
        });
      }
    },
    *evidenceOnChain({ payload }, { call, put }) {
      const res = yield call(API.evidenceOnChain, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result) {
        notification.success({ message: '存证上链成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '存证上链失败', top: 64, duration: 3 });
        return false;
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};

export default EvidenceModel;