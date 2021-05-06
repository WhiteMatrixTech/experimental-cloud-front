import * as API from '../services/contractStore.js';
import type { Reducer, Effect } from 'umi';

export type ContractStoreModelState = {
  repositoryList: Array<object>, // 合约仓库列表
  repositoryTotal: number,
  curRepository: object, // 当前合约仓库信息
  repositoryDetailList: Array<object>, // 合约仓库详情列表
  repositoryDetailTotal: number,
  fieldDescList: Array<object>, // 字段说明列表
  fieldDescTotal: number,
}

export type ContractStoreModelType = {
  namespace: 'ContractStore';
  state: ContractStoreModelState;
  effects: {
    getRepositoryListOfChainCode: Effect;
    getStoreSupplyListOfChainCode: Effect;
    getStoreSupplyExplainListOfChainCode: Effect;
  };
  reducers: {
    common: Reducer<ContractStoreModelState>;
  };
};

const ContractStoreModel: ContractStoreModelType = {
  namespace: 'ContractStore',

  state: {
    repositoryList: [],
    repositoryTotal: 0,
    curRepository: {},
    repositoryDetailList: [],
    repositoryDetailTotal: 0,
    fieldDescList: [],
    fieldDescTotal: 0,
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

export default ContractStoreModel;
