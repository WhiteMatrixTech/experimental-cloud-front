import * as API from '../services/privacy-strategy';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';
export interface StrategyListState {
  createdAt: string;
  networkName: string;
  strategyDesc: string;
  strategyMember: string[];
  strategyName: string;
  strategyStatus: number;
  updatedAt: string;
  _id: string;
  id: string;
}
export interface StrategyMemberListState {
  memberName: string;
  checked?: boolean;
}
export type PrivacyStrategyModelState = {
  strategyList: Array<StrategyListState>;
  strategyTotal: number;

  strategyMemberList: StrategyMemberListState[];
  leagueName: string;
  curStrategyMember: string[];
  protectRecordList: Array<object>;
  protectRecordTotal: number;
};

export type PrivacyStrategyModelType = {
  namespace: 'PrivacyStrategy';
  state: PrivacyStrategyModelState;
  effects: {
    getPageListOPrivacyStrategy: Effect;
    getPrivacyStrategyTotalDocs: Effect;
    createAndUpdateStrategy: Effect;
    modifyAndUpdateStrategy: Effect;
    updateStrategyStatus: Effect;
    getPageListOfRoleMember: Effect;
    updateStrategyMember: Effect;
    getPageListOfRecord: Effect;
  };
  reducers: {
    common: Reducer<PrivacyStrategyModelState>;
  };
};

const PrivacyStrategyModel: PrivacyStrategyModelType = {
  namespace: 'PrivacyStrategy',

  state: {
    strategyList: [], // 隐私保护策略列表
    strategyTotal: 0,

    strategyMemberList: [], // 关联成员列表
    leagueName: '', //联盟名称
    curStrategyMember: [], // 当前策略已关联成员

    protectRecordList: [], // 隐私保护记录列表
    protectRecordTotal: 0,
  },

  effects: {
    *getPageListOPrivacyStrategy({ payload }, { call, put }) {
      const res = yield call(API.getPageListOPrivacyStrategy, payload);
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
    *getPrivacyStrategyTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getPrivacyStrategyTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            strategyTotal: result.count,
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
        notification.success({ message: succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
        return false;
      }
    },

    *modifyAndUpdateStrategy({ payload }, { call, put }) {
      const res = yield call(API.modifyAndUpdateStrategy, payload);
      const { statusCode, result } = res;
      const succMessage = `修改隐私保护策略成功`;
      const failMessage = `修改隐私保护策略失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
        return false;
      }
    },
    *updateStrategyStatus({ payload }, { call, put }) {
      const res = yield call(API.updateStrategyStatus, payload);
      const { statusCode, result } = res;
      const { strategyStatus } = payload;
      const succMessage = `${strategyStatus === 0 ? '停用' : '启用'}隐私保护策略成功`;
      const failMessage = `${strategyStatus === 0 ? '停用' : '启用'}隐私保护策略失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
        return false;
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
        notification.success({ message: '配置隐私保护策略成功', top: 64, duration: 3 });
        yield put({
          type: 'common',
          payload: {},
        });
        return true;
      } else {
        notification.error({
          message: result.message || '配置隐私保护策略失败',
          top: 64,
          duration: 3,
        });
        return false;
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

export default PrivacyStrategyModel;
