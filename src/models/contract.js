import * as API from '../services/contract.js';
import { notification } from 'antd';

export default {
  namespace: 'Contract',

  state: {
    channelList: [], // 创建合约通道下拉框列表
    orgListWithChannel: [], // 创建合约组织下拉框列表
    myContractList: [], // 我的合约列表
    myContractTotal: 0,

    curContractDetail: {}, // 当前合约详情
    curContractVersionList: [], // 当前合约版本历史列表
    curContractVersionTotal: 0,
    curVersionApprovalList: [], // 当前版本合约审批历史列表
    curVersionApprovalTotal: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) { },
  },

  effects: {
    *getChainCodeList({ payload }, { call, put }) {
      const res = yield call(API.getChainCodeList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myContractList: result.items,
            myContractTotal: result.length
          },
        });
      }
    },

    *getDetailOfChainCode({ payload }, { call, put }) {
      const res = yield call(API.getDetailOfChainCode, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            curContractDetail: result,
          },
        });
      }
    },

    *getChainCodeHistory({ payload }, { call, put }) {
      const res = yield call(API.getChainCodeHistory, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            curContractVersionList: result.items,
          },
        });
      }
    },

    *getChainCodeHistoryTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getChainCodeHistoryTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            curContractVersionTotal: result,
          },
        });
      }
    },

    *getChainCodeApprovalHistory({ payload }, { call, put }) {
      const res = yield call(API.getChainCodeApprovalHistory, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            curVersionApprovalList: result.items,
          },
        });
      }
    },

    *getChainCodeApprovalHistoryTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getChainCodeApprovalHistoryTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            curVersionApprovalTotal: result,
          },
        });
      }
    },

    *setChainCodeApproveReject({ payload }, { call, put }) {
      const res = yield call(API.setChainCodeApproveReject, payload);
      const { statusCode, result } = res;
      const { chainCodeStatus } = payload;
      const succMessage = `${chainCodeStatus === 4 ? '通过' : '驳回'}合约成功`;
      const failMessage = `${chainCodeStatus === 4 ? '通过' : '驳回'}合约失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: res.message || failMessage, top: 64, duration: 1 });
      }
    },

    *getChannelList({ payload }, { call, put }) {
      const res = yield call(API.getChannelList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            channelList: result,
          },
        });
      }
    },

    *getOrgListWithChannel({ payload }, { call, put }) {
      const res = yield call(API.getOrgListWithChannel, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            orgListWithChannel: result.items,
          },
        });
      }
    },

    *addContract({ payload }, { call, put }) {
      const res = yield call(API.addContract, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result) {
        notification.success({ message: '新增合约成功', top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: res.message || '新增合约失败', top: 64, duration: 1 });
      }
    },

    *upgrateContract({ payload }, { call, put }) {
      const res = yield call(API.upgrateContract, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result) {
        notification.success({ message: '合约升级成功', top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: res.message || '合约升级失败', top: 64, duration: 1 });
      }
    },

    *releaseContract({ payload }, { call, put }) {
      const res = yield call(API.releaseContract, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result) {
        notification.success({ message: '发布合约成功', top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: res.message || '发布合约失败', top: 64, duration: 1 });
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
