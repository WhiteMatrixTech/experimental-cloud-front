import { getBlockList, getBlockTotalDocs } from '../services/block';
import { getTransactionList, getTransactionTotalDocs } from '../services/transactions';
import { getMemberTotalDocs } from '../services/enterprise-member';
import { getChannelList } from '../services/channel';
import { getChainCodeList } from '../services/contract';
import { getMyNetworkList } from '../services/user';
import * as API from '../services/dashboard';
import { notification } from 'antd';
import moment from 'moment';
import type { Reducer, Effect, BlockSchema, TransactionSchema } from 'umi';
import { NetworkStatus } from '~/utils/networkStatus';
import { formatMessage } from 'umi';

export type DashboardModelState = {
  networkStatusInfo: {
    networkStatus: NetworkStatus;
    createdAt: Date;
  } | null; // 网络状态信息

  // 统计信息
  blockTotal: number;
  transactionTotal: number;
  memberTotal: number;
  channelTotal: number;
  myContractTotal: number;

  blockList: BlockSchema[]; // 区块链列表
  transactionList: TransactionSchema[]; // 交易列表
};

export type DashboardModelType = {
  namespace: 'Dashboard';
  state: DashboardModelState;
  effects: {
    getNetworkInfo: Effect;
    createNetwork: Effect;
    stopNetwork: Effect;
    restartNetwork: Effect;
    deleteNetwork: Effect;
    getBlockList: Effect;
    getTransactionList: Effect;
    getStaticInfoForAdmin: Effect;
    getStaticInfoForMember: Effect;
  };
  reducers: {
    common: Reducer<DashboardModelState>;
  };
};

const DashboardModel: DashboardModelType = {
  namespace: 'Dashboard',

  state: {
    networkStatusInfo: null,

    blockTotal: 0,
    transactionTotal: 0,
    memberTotal: 0,
    channelTotal: 0,
    myContractTotal: 0,

    blockList: [],
    transactionList: []
  },

  effects: {
    *getNetworkInfo({ payload }, { call, put }) {
      const res = yield call(API.getNetworkInfo, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            networkStatusInfo: result
          }
        });
      }
    },

    *createNetwork({ payload }, { call, put }) {
      const res = yield call(API.createNetwork, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' || result.status === 'Starting') {
        notification.success({
          message: formatMessage({ id: 'BASS_NOTIFICATION_DASHBOARD_NEW_NETWORK_SUCCESS' }),
          top: 64,
          duration: 3
        });
        return true;
      } else {
        notification.error({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_DASHBOARD_NEW_NETWORK_FAILED' }),
          top: 64,
          duration: 3
        });
        return false;
      }
    },

    *stopNetwork({ payload }, { call, put }) {
      const res = yield call(API.stopNetwork, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' || result.status === 'Starting') {
        notification.success({
          message: formatMessage({ id: 'BASS_NOTIFICATION_DASHBOARD_STOP_NETWORK_SUCCESS' }),
          top: 64,
          duration: 3
        });
        return true;
      } else {
        notification.error({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_DASHBOARD_STOP_NETWORK_FAILED' }),
          top: 64,
          duration: 3
        });
        return false;
      }
    },

    *restartNetwork({ payload }, { call, put }) {
      const res = yield call(API.restartNetwork, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' || result.status === 'Starting') {
        notification.success({
          message: formatMessage({ id: 'BASS_NOTIFICATION_DASHBOARD_RESTART_NETWORK_SUCCESS' }),
          top: 64,
          duration: 3
        });
        return true;
      } else {
        notification.error({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_DASHBOARD_RESTART_NETWORK_FAILED' }),
          top: 64,
          duration: 3
        });
        return false;
      }
    },

    *deleteNetwork({ payload }, { call, put }) {
      const res = yield call(API.deleteNetwork, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({
          message: formatMessage({ id: 'BASS_NOTIFICATION_DASHBOARD_DELETE_SUCCESS' }),
          top: 64,
          duration: 3
        });
        yield put({
          type: 'getNetworkInfo',
          payload: {}
        });
      } else {
        notification.error({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_DASHBOARD_DELETE_FAILED' }),
          top: 64,
          duration: 3
        });
      }
    },

    *getBlockList({ payload }, { call, put }) {
      const res = yield call(getBlockList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockList: result.items
          }
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
            transactionList: result.items
          }
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
          from: Number(moment(new Date()).format('x'))
        }),
        call(getChannelList, payload),
        call(getChainCodeList, {
          ...payload,
          offset: 0,
          limit: 1000,
          from: Number(moment(new Date()).format('x')),
          ascend: false
        })
      ]);
      const blockTotal = res1.statusCode === 'ok' ? res1.result.count : 0;
      const transactionTotal = res2.statusCode === 'ok' ? res2.result.count : 0;
      const memberTotal = res3.statusCode === 'ok' ? res3.result.count : 0;
      const channelTotal = res4.statusCode === 'ok' ? res4.result.length : 0;
      const myContractTotal = res5.statusCode === 'ok' ? res5.result.items.length : 0;
      yield put({
        type: 'common',
        payload: {
          blockTotal,
          transactionTotal,
          memberTotal,
          channelTotal,
          myContractTotal
        }
      });
    },

    *getStaticInfoForMember({ payload }, { call, put, all }) {
      const [res1, res2, res3, res4, res5] = yield all([
        call(getBlockTotalDocs, payload),
        call(getTransactionTotalDocs, payload),
        call(getMyNetworkList, payload),
        call(getChannelList, payload),
        call(getChainCodeList, {
          ...payload,
          offset: 0,
          limit: 1000,
          from: Number(moment(new Date()).format('x')),
          ascend: false
        })
      ]);
      const blockTotal = res1.statusCode === 'ok' ? res1.result.count : 0;
      const transactionTotal = res2.statusCode === 'ok' ? res2.result.count : 0;
      const memberTotal = res3.statusCode === 'ok' ? res3.result.length : 0;
      const channelTotal = res4.statusCode === 'ok' ? res4.result.length : 0;
      const myContractTotal = res5.statusCode === 'ok' ? res5.result.items.length : 0;
      yield put({
        type: 'common',
        payload: {
          blockTotal,
          transactionTotal,
          memberTotal,
          channelTotal,
          myContractTotal
        }
      });
    }
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    }
  }
};

export default DashboardModel;
