import * as API from '../services/contractStore.js';

export default {
  namespace: 'ContractStore',

  state: {
    repositoryList: [], // 合约仓库列表
    repositoryTotal: 0,
    curRepository: {}, // 当前合约仓库信息
    repositoryDetailList: [], // 合约仓库详情列表
    repositoryDetailTotal: 0,
    fieldDescList: [], // 字段说明列表
    fieldDescTotal: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) { },
  },

  effects: {
    *getRepositoryListOfChainCode({ payload }, { call, put }) {
      const res = yield call(API.getRepositoryListOfChainCode, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            repositoryList: result.list,
            repositoryTotal: result.totalDocs,
          },
        });
      }
    },

    *getStoreSupplyListOfChainCode({ payload }, { call, put }) {
      const res = yield call(API.getStoreSupplyListOfChainCode, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            repositoryDetailList: result.list,
            repositoryDetailTotal: result.totalDocs,
          },
        });
      }
    },

    *getStoreSupplyExplainListOfChainCode({ payload }, { call, put }) {
      const res = yield call(API.getStoreSupplyExplainListOfChainCode, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            fieldDescList: result.list,
            fieldDescTotal: result.totalDocs,
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
