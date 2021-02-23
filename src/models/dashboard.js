import { getBlockList, getBlockTotalDocs } from '../services/block.js';
import { getTransactionList, getTransactionTotalDocs } from '../services/transactions.js';
import { getMemberTotalDocs } from '../services/member.js';
import { getUnionList } from '../services/union.js';
import { getChainCodeList } from '../services/contract.js';
import { getMyNetworkList } from '../services/user.js';
import * as API from '../services/dashboard.js';
import { notification } from 'antd';
import moment from 'moment';

export default {
  namespace: 'Dashboard',

  state: {
    networkStatusInfo: {}, // 网络状态信息

    // 统计信息
    blockTotal: 0,
    transactionTotal: 0,
    memberTotal: 0,
    unionTotal: 0,
    myContractTotal: 0,

    blockList: [], // 区块链列表
    transactionList: [], // 交易列表
  },

  effects: {
    *getNetworkInfo({ payload }, { call, put }) {
      const res = yield call(API.getNetworkInfo, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            networkStatusInfo: result,
          },
        });
      }
    },
    *createNetwork({ payload }, { call, put }) {
      const res = yield call(API.createNetwork, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' || result.status === 'Starting') {
        notification.success({ message: '创建网络请求发起成功', top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: result.message || '创建网络请求发起成功', top: 64, duration: 1 });
      }
    },
    *deleteNetwork({ payload }, { call, put }) {
      const res = yield call(API.deleteNetwork, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '网络删除成功', top: 64, duration: 1 });
        yield put({
          type: 'getNetworkInfo',
          payload: {},
        });
      } else {
        notification.error({ message: result.message || '网络删除失败', top: 64, duration: 1 });
      }
    },
    *getBlockList({ payload }, { call, put }) {
      const res = yield call(getBlockList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockList: result.items,
          },
        });
      }
    },
    *getTransactionList({ payload }, { call, put }) {
      const res = yield call(getTransactionList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionList: result.items,
          },
        });
      }
    },
    *getStaticInfoForAdmin({ payload }, { call, put, all }) {
      const [res1, res2, res3, res4, res5] = yield all([
        call(getBlockTotalDocs, payload),
        call(getTransactionTotalDocs, payload),
        call(getMemberTotalDocs, {
          ...payload,
          approvalStatus: 'any',
          companyName: '',
          createTimeEnd: 0,
          createTimeStart: 0,
          from: Number(moment(new Date()).format('x')),
        }),
        call(getUnionList, payload),
        call(getChainCodeList, {
          ...payload,
          offset: 0,
          limit: 5,
          from: Number(moment(new Date()).format('x')),
          ascend: false,
        }),
      ]);
      const blockTotal = res1.statusCode === 'ok' ? res1.result : 0;
      const transactionTotal = res2.statusCode === 'ok' ? res2.result : 0;
      const memberTotal = res3.statusCode === 'ok' ? res3.result : 0;
      const unionTotal = res4.statusCode === 'ok' ? res4.result.length : 0;
      const myContractTotal = res5.statusCode === 'ok' ? res5.result.items.length : 0;
      yield put({
        type: 'common',
        payload: {
          blockTotal,
          transactionTotal,
          memberTotal,
          unionTotal,
          myContractTotal,
        },
      });
    },
    *getStaticInfoForMember({ payload }, { call, put, all }) {
      const [res1, res2, res3, res4, res5] = yield all([
        call(getBlockTotalDocs, payload),
        call(getTransactionTotalDocs, payload),
        call(getMyNetworkList, payload),
        call(getUnionList, payload),
        call(getChainCodeList, {
          ...payload,
          offset: 0,
          limit: 5,
          from: Number(moment(new Date()).format('x')),
          ascend: false,
        }),
      ]);
      const blockTotal = res1.statusCode === 'ok' ? res1.result : 0;
      const transactionTotal = res2.statusCode === 'ok' ? res2.result : 0;
      const memberTotal = res3.statusCode === 'ok' ? res3.result.length : 0;
      const unionTotal = res4.statusCode === 'ok' ? res4.result.length : 0;
      const myContractTotal = res5.statusCode === 'ok' ? res5.result.items.length : 0;
      yield put({
        type: 'common',
        payload: {
          blockTotal,
          transactionTotal,
          memberTotal,
          unionTotal,
          myContractTotal,
        },
      });
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
