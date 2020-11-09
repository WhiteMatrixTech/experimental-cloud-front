import * as API from 'services/contract.js';
import { notification } from 'antd';

export default {
  namespace: 'Contract',

  state: {
    myContractList: [], // 我的合约列表
    myContractTotal: 0,

    curContractDetail: {}, // 当前合约详情
    curContractVersionList: [], // 当前合约版本历史列表
    curContractVersionTotal: 0,
    curVersionApprovalList: [], // 当前版本合约审批历史列表
    curVersionApprovalTotal: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *getPageListOfChainCode({ payload }, { call, put }) {
      const res = yield call(API.getPageListOfChainCode, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myContractList: result.list,
            myContractTotal: result.totalDocs
          }
        });
      }
    },
    *getDetailOfChainCode({ payload }, { call, put }) {
      const res = yield call(API.getDetailOfChainCode, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            curContractDetail: result
          }
        });
      }
    },
    *getChainCodeHistory({ payload }, { call, put }) {
      const res = yield call(API.getChainCodeHistory, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            curContractVersionList: result.list,
            curContractVersionTotal: result.totalDocs
          }
        });
      }
    },
    *getChainCodeApprovalHistory({ payload }, { call, put }) {
      const res = yield call(API.getChainCodeApprovalHistory, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            curVersionApprovalList: result.list,
            curVersionApprovalTotal: result.totalDocs
          }
        });
      }
    },
    *setChainCodeApproveReject({ payload }, { call, put }) {
      const res = yield call(API.setChainCodeApproveReject, payload)
      const { status, result } = res;
      const { chainCodeStatus } = payload;
      const succMessage = `${chainCodeStatus === 4 ? '通过' : '驳回'}合约成功`;
      const failMessage = `${chainCodeStatus === 4 ? '通过' : '驳回'}合约失败`;
      if (status === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 1 })
        return true
      } else {
        notification.error({ message: res.message || failMessage, top: 64, duration: 1 })
      }
    },
    *addContract({ payload }, { call, put }) {
      const res = yield call(API.addContract, payload)
      const { status, result } = res;
      const { type } = payload;
      const succMessage = `${type === 1 ? '新增' : '修改'}合约成功`;
      const failMessage = `${type === 2 ? '新增' : '修改'}合约失败`;
      if (status === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 1 })
        return true
      } else {
        notification.error({ message: res.message || failMessage, top: 64, duration: 1 })
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
