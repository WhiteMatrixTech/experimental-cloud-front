import * as API from '../services/privacyStrategy.js';
import { notification } from 'antd';

export default {
  namespace: 'PrivacyStrategy',

  state: {
    strategyList: [], // 隐私保护策略列表
    strategyTotal: 0,

    strategyMemberList: [],// 关联成员列表
    leagueName: '',        //联盟名称
    curStrategyMember: [], // 当前策略已关联成员

    protectRecordList: [], // 隐私保护记录列表
    protectRecordTotal: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) { },
  },

  effects: {

    *getPageListOfRoleData({ payload }, { call, put }) {
      const res = yield call(API.getPageListOfRoleData, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            strategyList: result.items,
          },
        });
      }
    },
    *getRoleDateTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getRoleDateTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            strategyTotal: result,
          },
        });
      }
    },
    *createAndUpdateStrategy({ payload }, { call, put }) {
      const res = yield call(API.createAndUpdateStrategy, payload);
      const { statusCode, result } = res;
      const succMessage = `新增隐私保护策略成功`;
      const failMessage = `新增隐私保护策略失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 1 });
        return true;
      } else if (res.statusCode === 400 && res.message.indexOf('E11000') != -1) {
        notification.error({ message: 'Duplicate Key Error' || failMessage, top: 64, duration: 1 });
      } else {
        notification.error({ message: res.message || failMessage, top: 64, duration: 1 });
      }
    },

    *modifyAndUpdateStrategy({ payload }, { call, put }) {
      const res = yield call(API.modifyAndUpdateStrategy, payload);
      const { statusCode, result } = res;
      const succMessage = `修改隐私保护策略成功`;
      const failMessage = `修改隐私保护策略失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: res.message || failMessage, top: 64, duration: 1 });
      }
    },
    *updateStrategyStatus({ payload }, { call, put }) {
      const res = yield call(API.updateStrategyStatus, payload);
      const { statusCode, result } = res;
      const { strategyStatus } = payload;
      const succMessage = `${strategyStatus === 0 ? '停用' : '启用'}隐私保护策略成功`;
      const failMessage = `${strategyStatus === 0 ? '停用' : '启用'}隐私保护策略失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: res.message || failMessage, top: 64, duration: 1 });
      }
    },
    *getPageListOfRoleMember({ payload }, { call, put }) {
      const res = yield call(API.getPageListOfRoleMember, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            strategyMemberList: result.strategyConfig,
            leagueName: result.leagueName,
          },
        });
      }
    },
    *updateStrategyMember({ payload }, { call, put }) {
      const res = yield call(API.updateStrategyMember, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result) {
        notification.success({ message: '配置隐私保护策略成功', top: 64, duration: 1 });
        yield put({
          type: 'common',
          payload: {},
        });
        return true;
      } else {
        notification.error({
          message: res.message || '配置隐私保护策略失败',
          top: 64,
          duration: 1,
        });
      }
    },
    *getPageListOfRecord({ payload }, { call, put }) {
      const res = yield call(API.getPageListOfRecord, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            protectRecordList: result.validMembers,
            protectRecordTotal: result.strategyMember.strategyMember,
          },
        });
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
