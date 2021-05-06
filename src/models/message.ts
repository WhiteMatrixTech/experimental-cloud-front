import * as API from '../services/message.js';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';

export type MessageModelState = {
  selectedMessageTab: string, // 当前选中的消息类别
  messageList: Array<object>, // 消息列表
  messageTotal: number, // 当前分类下的消息总数
  messageDetail: object, // 当前消息详情
  unreadMesNum: number, // 总未读消息数
  unreadMesGroup: Array<object>, // 每类消息下的未读数
}

export type MessageModelType = {
  namespace: 'Message';
  state: MessageModelState;
  effects: {
    getMessageList: Effect;
    getMesDetail: Effect;
    getAllUnreadMessage: Effect;
    getUnreadMesGroup: Effect;
    batchReadMes: Effect;
    batchDeleteMes: Effect;
    deleteMes: Effect;
  };
  reducers: {
    common: Reducer<MessageModelState>;
  };
};

const MessageModel: MessageModelType = {
  namespace: 'Message',

  state: {
    selectedMessageTab: 'all',
    messageList: [],
    messageTotal: 0,
    messageDetail: {},
    unreadMesNum: 0,
    unreadMesGroup: [],
  },

  effects: {
    *getMessageList({ payload }, { call, put }) {
      const res = yield call(API.getMessageList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            messageList: result.list,
            messageTotal: result.totalDocs,
          },
        });
      }
    },
    *getMesDetail({ payload }, { call, put }) {
      const res = yield call(API.getMesDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            messageDetail: result,
          },
        });
      }
    },
    *getAllUnreadMessage({ payload }, { call, put }) {
      const res = yield call(API.getAllUnreadMessage, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            unreadMesNum: result,
          },
        });
      }
    },
    *getUnreadMesGroup({ payload }, { call, put }) {
      const res = yield call(API.getUnreadMesGroup, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            unreadMesGroup: result,
          },
        });
      }
    },
    *batchReadMes({ payload }, { call, put }) {
      const res = yield call(API.batchReadMes, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result === 1) {
        notification.success({ message: '消息标记已读成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '消息标记已读失败', top: 64, duration: 3 });
        return false;
      }
    },
    *batchDeleteMes({ payload }, { call, put }) {
      const res = yield call(API.batchDeleteMes, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result === 1) {
        notification.success({ message: '批量删除消息成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '批量删除消息失败', top: 64, duration: 3 });
        return false;
      }
    },
    *deleteMes({ payload }, { call, put }) {
      const res = yield call(API.deleteMes, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result === 1) {
        notification.success({ message: '删除消息成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '删除消息失败', top: 64, duration: 3 });
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};

export default MessageModel;
