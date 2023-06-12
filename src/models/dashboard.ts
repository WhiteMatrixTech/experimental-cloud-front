import { getBlockList, getBlockTotalDocs } from '../services/block';
import { getTransactionList, getTransactionTotalDocs } from '../services/transactions';
import { getMemberTotal } from '../services/member';
import { getChannelList } from '../services/channel';
import { getChainCodeList } from '../services/contract';
import { getMyNetworkList } from '../services/user';
import * as API from '../services/dashboard';
import { notification } from 'antd';
import moment from 'moment';
import type { Reducer, Effect, BlockSchema, TransactionSchema } from 'umi';
import { NetworkStatus } from '~/utils/networkStatus';

interface INetworkInfo {
  name: string;
  description: string;
  clusterName?: string;
  createTime?: string;
  updateTime?: string;
  status: NetworkStatus;
  caCertExpiryTime: string;
  consensus: "etcdraft"|"solo",
  maxMessageCount: number;
  batchTimeout: string;
}

export type DashboardModelState = {
  networkStatusInfo: INetworkInfo | null; // 网络状态信息

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
    createNetworkDefault: Effect;
    createNetworkCustom: Effect;
    stopNetwork: Effect;
    restartNetwork: Effect;
    deleteNetwork: Effect;
    getBlockList: Effect;
    getTransactionList: Effect;
    getStaticInfoForAdmin: Effect;
    getStaticInfoForMember: Effect;
    configNetwork: Effect;
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
    *getNetworkInfo({ payload }, { call, put }): any {
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

    *configNetwork({ payload }, { call, put }): any {
      const res = yield call(API.configNetwork, payload);
      const { statusCode } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '更新网络配置成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: '更新网络配置失败', top: 64, duration: 3 });
        return false;
      }
    },

    *createNetworkDefault({ payload }, { call, put }): any {
      const res = yield call(API.createNetworkDefault, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' || result.status === 'Starting') {
        notification.success({ message: '创建网络请求发起成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.msg || '创建网络请求发起失败', top: 64, duration: 3 });
        return false;
      }
    },

    *createNetworkCustom({ payload }, { call, put }): any {
      const res = yield call(API.createNetworkCustom, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' || result.status === 'Starting') {
        notification.success({ message: '创建网络请求发起成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.msg || '创建网络请求发起失败', top: 64, duration: 3 });
        return false;
      }
    },

    *stopNetwork({ payload }, { call, put }): any {
      const res = yield call(API.stopNetwork, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' || result.status === 'Starting') {
        notification.success({ message: '停用网络请求发起成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.msg || '停用网络请求发起失败', top: 64, duration: 3 });
        return false;
      }
    },

    *restartNetwork({ payload }, { call, put }): any {
      const res = yield call(API.restartNetwork, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' || result.status === 'Starting') {
        notification.success({ message: '重启网络请求发起成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.msg || '重启网络请求发起失败', top: 64, duration: 3 });
        return false;
      }
    },

    *deleteNetwork({ payload }, { call, put }): any {
      const res = yield call(API.deleteNetwork, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'getNetworkInfo',
          payload: {}
        });
        return true;
      } else {
        notification.error({ message: result.msg || '删除网络请求提交失败', top: 64, duration: 3 });
        return false;
      }
    },

    *getBlockList({ payload }, { call, put }): any {
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

    *getTransactionList({ payload }, { call, put }): any {
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
        call(getMemberTotal, {
          ...payload,
          createTimeEnd: 0,
          createTimeStart: 0
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
