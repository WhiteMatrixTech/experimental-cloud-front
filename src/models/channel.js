import * as API from '../services/channel.js';
import { notification } from 'antd';

export default {
  namespace: 'Channel',

  state: {
    channelList: [], // 通道列表
    channelTotal: 0,

    orgListOfChannel: [], // 当前通道下的组织列表
    orgTotalOfChannel: 0,

    nodeListOfChannel: [], // 当前通道下的节点列表
    nodeTotalOfChannel: 0,

    contractListOfChannel: [], // 当前通道下的合约列表
    contractTotalOfChannel: 0,

    blockListOfChannel: [], // 当前通道下的区块列表
    blockTotalOfChannel: 0,

    transactionListOfChannel: [], // 当前通道下的交易列表
    transactionTotalOfChannel: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *createChannel({ payload }, { call, put }) {
      const res = yield call(API.createChannel, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '通道创建请求发送成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '通道创建请求发送失败', top: 64, duration: 3 });
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
            channelTotal: result.length,
          },
        });
      }
    },
    *getOrgListOfChannel({ payload }, { call, put }) {
      const res = yield call(API.getOrgListOfChannel, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            orgListOfChannel: result,
            orgTotalOfChannel: result.length,
          },
        });
      }
    },
    *getNodeListOfChannel({ payload }, { call, put }) {
      const res = yield call(API.getNodeListOfChannel, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            nodeListOfChannel: result,
            nodeTotalOfChannel: result.length,
          },
        });
      }
    },
    *getContractListOfChannel({ payload }, { call, put }) {
      const res = yield call(API.getContractListOfChannel, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            contractListOfChannel: result.items,
          },
        });
      }
    },
    *getContractTotalOfChannel({ payload }, { call, put }) {
      const res = yield call(API.getContractTotalOfChannel, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            contractTotalOfChannel: result.count,
          },
        });
      }
    },
    *getBlockListOfChannel({ payload }, { call, put }) {
      const res = yield call(API.getBlockListOfChannel, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockListOfChannel: result.items,
          },
        });
      }
    },
    *getTransactionsListOfChannel({ payload }, { call, put }) {
      const res = yield call(API.getTransactionsListOfChannel, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionListOfChannel: result.items,
          },
        });
      }
    },
    *getStaticInfo({ payload }, { call, put, all }) {
      const [blockRes, transactionRes, orgRes, nodeRes, contractRes] = yield all([
        call(API.getBlockTotalOfChannel, payload),
        call(API.getTransactionsTotalOfChannel, payload),
        call(API.getOrgListOfChannel, payload),
        call(API.getNodeListOfChannel, payload),
        call(API.getContractTotalOfChannel, payload),
      ]);
      const blockTotalOfChannel = blockRes.statusCode === 'ok' ? blockRes.result.count : 0;
      const transactionTotalOfChannel = transactionRes.statusCode === 'ok' ? transactionRes.result.count : 0;
      const orgTotalOfChannel = orgRes.statusCode === 'ok' ? orgRes.result.length : 0;
      const nodeTotalOfChannel = nodeRes.statusCode === 'ok' ? nodeRes.result.length : 0;
      const contractTotalOfChannel = contractRes.statusCode === 'ok' ? contractRes.result.count : 0;
      yield put({
        type: 'common',
        payload: {
          orgTotalOfChannel,
          nodeTotalOfChannel,
          blockTotalOfChannel,
          contractTotalOfChannel,
          transactionTotalOfChannel,
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
