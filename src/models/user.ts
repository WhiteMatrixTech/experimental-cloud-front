import * as API from '../services/user.js';
import { notification } from 'antd';
import { Roles } from '../utils/roles.js';
import LoginStatus from '../utils/loginStatus';
import type { Reducer, Effect } from 'umi';

export type UserModelState = {
  userInfo: object,
  accessToken: string,
  roleToken: string,
  loginInfo: string,
  loginStatus: string,
  cacheAccount: object,
  userAndRegister: boolean,

  networkList: Array<object>,
  myNetworkList: Array<object>,

  userRole: string,
  networkName: string,
  leagueName: string,
}

export type UserModelType = {
  namespace: 'User';
  state: UserModelState;
  effects: {
    register: Effect;
    login: Effect;
    getUserInfo: Effect;
    getNetworkList: Effect;
    getMyNetworkList: Effect;
    enterLeague: Effect;
    enrollInLeague: Effect;
    createLeague: Effect;
  };
  subscriptions: {
    setup({ dispatch, history }: {
      dispatch: any;
      history: any;
    }): any
  };
  reducers: {
    common: Reducer<UserModelState>;
  };
};

const storageUserInfo = localStorage.getItem('userInfo')
const userInfo = storageUserInfo ? JSON.parse(storageUserInfo) : {};

const UserModel: UserModelType = {
  namespace: 'User',

  state: {
    userInfo: userInfo,
    accessToken: '', // 登录token
    roleToken: '', // 角色token
    loginInfo: '',
    loginStatus: '',
    cacheAccount: {}, // 当前注册的账户
    userAndRegister: false, // 控制注册成功后的自动跳转

    networkList: [], // 网络列表
    myNetworkList: [], // 我的网络列表

    userRole: localStorage.getItem('userRole') || Roles.NetworkMember, // 进入系统的身份
    networkName: localStorage.getItem('networkName') || 'network1', // 进入系统时的网络
    leagueName: localStorage.getItem('leagueName') || '', // 进入系统时的联盟
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }: { pathname: string }) => {
        if (pathname.indexOf('/selectLeague') > -1) {
          dispatch({ type: 'getUserInfo' });
          dispatch({ type: 'getNetworkList' });
          dispatch({ type: 'getMyNetworkList' });
        }
      });
    },
  },

  effects: {
    *register({ payload }, { call, put }) {
      const res = yield call(API.register, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result.user) {
        yield put({
          type: 'common',
          payload: {
            cacheAccount: result,
            userAndRegister: true,
          },
        });
        return true;
      } else {
        notification.error({ message: result.message || result.error || '用户注册失败', top: 64, duration: 3 });
        return false;
      }
    },
    *login({ payload }, { call, put }) {
      const res = yield call(API.login, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result.access_token) {
        yield put({
          type: 'common',
          payload: {
            userInfo: payload,
            accessToken: result.access_token,
          },
        });
        return result;
      } else {
        yield put({
          type: 'common',
          payload: {
            loginInfo: result.message || '',
            loginStatus: LoginStatus.LOGIN_ERROR,
          },
        });
      }
    },
    *getUserInfo({ payload }, { call, put }) {
      const res = yield call(API.getUserInfo, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        localStorage.setItem('userInfo', JSON.stringify(result));
        yield put({
          type: 'common',
          payload: {
            userInfo: result,
          },
        });
      }
    },
    *getNetworkList({ payload }, { call, put }) {
      const res = yield call(API.getNetworkList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: { networkList: result },
        });
      }
    },
    *getMyNetworkList({ payload }, { call, put }) {
      const res = yield call(API.getMyNetworkList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myNetworkList: result,
          },
        });
      }
    },
    *enterLeague({ payload }, { call, put }) {
      const res = yield call(API.enterLeague, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result.role_token) {
        yield put({
          type: 'common',
          payload: {
            roleToken: result.role_token,
          },
        });
        localStorage.setItem('roleToken', result.role_token);
        return true;
      } else {
        notification.error({ message: result.message || '无法进入联盟', top: 64, duration: 3 });
        return false;
      }
    },
    *enrollInLeague({ payload }, { call, put }) {
      const res = yield call(API.enrollInLeague, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '已成功申请加入联盟，请等待盟主审批', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '申请加入联盟失败', top: 64, duration: 3 });
        return false;
      }
    },
    *createLeague({ payload }, { call, put }) {
      const res = yield call(API.createLeague, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '联盟创建成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '联盟创建失败', top: 64, duration: 3 });
        return false;
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};

export default UserModel;
