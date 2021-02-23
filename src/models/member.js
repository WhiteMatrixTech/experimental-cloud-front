import * as API from '../services/member.js';
import { notification } from 'antd';

export default {
  namespace: 'Member',

  state: {
    memberList: [], // 成员企业列表
    memberTotal: 0,

    memberDetail: {}, // 当前成员企业详情
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *getMemberTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getMemberTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            memberTotal: result.count,
          },
        });
      }
    },
    *getPageListOfCompanyMember({ payload }, { call, put }) {
      const res = yield call(API.getPageListOfCompanyMember, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            memberList: result.items,
          },
        });
      }
    },
    *getMemberDetail({ payload }, { call, put }) {
      const res = yield call(API.getMemberDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            memberDetail: result,
          },
        });
      }
    },
    *setStatusOfLeagueConpany({ payload }, { call, put }) {
      const res = yield call(API.setStatusOfLeagueConpany, payload);
      const { statusCode, result } = res;
      const { isValid } = payload;
      const succMessage = `${isValid === 'invalid' ? '停用' : '启用'}企业成员成功`;
      const failMessage = `${isValid === 'invalid' ? '停用' : '启用'}企业成员失败`;
      if (statusCode === 'ok' && result === 1) {
        notification.success({ message: succMessage, top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 1 });
      }
    },
    *setCompanyApprove({ payload }, { call, put }) {
      const res = yield call(API.setCompanyApprove, payload);
      const { statusCode, result } = res;
      const { approvalStatus } = payload;
      const succMessage = `${approvalStatus === 'approved' ? '通过' : '驳回'}企业成员成功`;
      const failMessage = `${approvalStatus === 'approved' ? '通过' : '驳回'}企业成员失败`;
      if (statusCode === 'ok' && result === 1) {
        notification.success({ message: succMessage, top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 1 });
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
