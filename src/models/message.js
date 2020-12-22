import * as API from 'services/message.js';
import { notification } from 'antd';

export default {
  namespace: 'Message',

  state: {
    selectdMessageTab: 'all', // 当前选中的消息类别
    messageList: [], // 消息列表
    messageTotal: 0, // 当前分类下的消息总数
    messageDetail: {}, // 当前消息详情
    unreadMesNum: 0, // 总未读消息数
    unreadMesGroup: [], // 每类消息下的未读数
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *getMessageList({ payload }, { call, put }) {
      const res = yield call(API.getMessageList, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            messageList: result.list,
            messageTotal: result.totalDocs
          }
        });
      }
    },
    *getMesDetail({ payload }, { call, put }) {
      const res = yield call(API.getMesDetail, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            messageDetail: result
          }
        });
      }
    },
    *getAllUnreadMessage({ payload }, { call, put }) {
      const res = yield call(API.getAllUnreadMessage, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            unreadMesNum: result
          }
        });
      }
    },
    *getUnreadMesGroup({ payload }, { call, put }) {
      const res = yield call(API.getUnreadMesGroup, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            unreadMesGroup: result
          }
        });
      }
    },
    *bacthReadMes({ payload }, { call, put }) {
      const res = yield call(API.bacthReadMes, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result === 1) {
        notification.success({ message: '消息标记已读成功', top: 64, duration: 1 })
        return true
      } else {
        notification.error({ message: res.message || '消息标记已读失败', top: 64, duration: 1 })
      }
    },
    *batchDeleteMes({ payload }, { call, put }) {
      const res = yield call(API.batchDeleteMes, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result === 1) {
        notification.success({ message: '批量删除消息成功', top: 64, duration: 1 })
        return true
      } else {
        notification.error({ message: res.message || '批量删除消息失败', top: 64, duration: 1 })
      }
    },
    *deleteMes({ payload }, { call, put }) {
      const res = yield call(API.deleteMes, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result === 1) {
        notification.success({ message: '删除消息成功', top: 64, duration: 1 })
        return true
      } else {
        notification.error({ message: res.message || '删除消息失败', top: 64, duration: 1 })
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
