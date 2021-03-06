import * as API from '../services/channel';
import { notification } from 'antd';
import type {
  Reducer,
  Effect,
  BlockSchema,
  TransactionSchema,
  OrganizationSchema,
  PeerSchema,
  ChainCodeSchema,
} from 'umi';

export type ChannelSchema = {
  _id: string;
  networkName: string; // 网络名称
  channelAliasName: string; // 通道别名
  channelDesc: string; // 通道描述
  channelId: string; // 通道id
  channelStatus: string; // 通道状态
  createUser: string; // 创建用户
  updatedAt: Date; // 更新时间 2021-01-29T02:47:00.959Z
  createdAt: Date; // 创建时间 2021-01-27T06:08:08.216Z
  openModal?: boolean;
};

export type ChannelModelState = {
  channelList: Array<ChannelSchema>; // 通道列表
  channelTotal: number;

  orgListOfChannel: Array<OrganizationSchema>; // 当前通道下的组织列表
  orgTotalOfChannel: number;

  nodeListOfChannel: Array<PeerSchema>; // 当前通道下的节点列表
  nodeTotalOfChannel: number;

  contractListOfChannel: Array<ChainCodeSchema>; // 当前通道下的合约列表
  contractTotalOfChannel: number;

  blockListOfChannel: Array<BlockSchema>; // 当前通道下的区块列表
  blockTotalOfChannel: number;

  transactionListOfChannel: Array<TransactionSchema>; // 当前通道下的交易列表
  transactionTotalOfChannel: number;
};

export type ChannelModelType = {
  namespace: 'Channel';
  state: ChannelModelState;
  effects: {
    createChannel: Effect;
    getChannelList: Effect;
    addOrgForChannel: Effect;
    getOrgListOfChannel: Effect;
    getNodeListOfChannel: Effect;
    getContractListOfChannel: Effect;
    getContractTotalOfChannel: Effect;
    getBlockListOfChannel: Effect;
    getTransactionsListOfChannel: Effect;
    getStaticInfo: Effect;
  };
  reducers: {
    common: Reducer<ChannelModelState>;
  };
};

const ChannelModel: ChannelModelType = {
  namespace: 'Channel',

  state: {
    channelList: [],
    channelTotal: 0,

    orgListOfChannel: [],
    orgTotalOfChannel: 0,

    nodeListOfChannel: [],
    nodeTotalOfChannel: 0,

    contractListOfChannel: [],
    contractTotalOfChannel: 0,

    blockListOfChannel: [],
    blockTotalOfChannel: 0,

    transactionListOfChannel: [],
    transactionTotalOfChannel: 0,
  },

  effects: {
    *createChannel({ payload }, { call, put }) {
      const res = yield call(API.createChannel, payload);
      const { statusCode, result } = res;
      console.log(res, '创建成功！');
      if (statusCode === 'ok') {
        notification.success({ message: '通道创建请求发送成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '通道创建请求发送失败', top: 64, duration: 3 });
        return false;
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

    *addOrgForChannel({ payload }, { call, put }): any {
      const res = yield call(API.addOrgForChannel, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '添加组织请求发送成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '添加组织请求发送失败', top: 64, duration: 3 });
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

export default ChannelModel;
