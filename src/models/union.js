import * as API from '../services/union.js';

export default {
  namespace: 'Union',

  state: {
    unionList: [], // 通道列表
    unionTotal: 0,

    orgListOfUnion: [], // 当前通道下的组织列表
    orgTotalOfUnion: 0,

    peerListOfUnion: [], // 当前通道下的节点列表
    peerTotalOfUnion: 0,

    contractListOfUnion: [], // 当前通道下的合约列表
    contractTotalOfUnion: 0,
    contractInfoOfUnion: {}
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *getUnionList({ payload }, { call, put }) {
      const res = yield call(API.getUnionList, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            unionList: result.list,
            unionTotal: result.totalDocs
          }
        });
      }
    },
    *getOrgListOfUnion({ payload }, { call, put }) {
      const res = yield call(API.getOrgListOfUnion, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            orgListOfUnion: result.list,
            orgTotalOfUnion: result.totalDocs
          }
        });
      }
    },
    *getPeerListOfUnion({ payload }, { call, put }) {
      const res = yield call(API.getPeerListOfUnion, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            peerListOfUnion: result.list,
            peerTotalOfUnion: result.totalDocs
          }
        });
      }
    },
    *getContractListOfUnion({ payload }, { call, put }) {
      const res = yield call(API.getContractListOfUnion, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            contractListOfUnion: result.list,
            contractTotalOfUnion: result.totalDocs
          }
        });
      }
    },
    *getContractSummaryOfUnion({ payload }, { call, put }) {
      const res = yield call(API.getContractSummaryOfUnion, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            contractInfoOfUnion: result
          }
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
