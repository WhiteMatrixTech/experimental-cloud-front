import * as API from '../services/user';
import { notification } from 'antd';
import { Roles } from '../utils/roles';
import LoginStatus from '../utils/loginStatus';
import type { Reducer, Effect } from 'umi';
import { NetworkStatus } from '~/utils/networkStatus';
import { formatMessage } from 'umi';

export type UserInfoSchema = {
  loginName: string;
  did: string;
  exp: number;
  iat: number;
  contactEmail: string;
  companyName: string;
  role: Roles;
};

export type LeagueSchema = {
  leagueName: string;
  leaderCompanyName: string;
  networkName: string;
  description: string;
  networkStatus: NetworkStatus;
  createdTime: string;
  timeAdded?: string;
  role?: Roles;
};

export type UserModelState = {
  userInfo: UserInfoSchema;
  accessToken: string;
  roleToken: string;
  loginInfo: string;
  loginStatus: string;
  cacheAccount: object;
  userAndRegister: boolean;

  networkList: Array<LeagueSchema>;
  myNetworkList: Array<LeagueSchema>;

  userRole: Roles;
  networkName: string;
  leagueName: string;
};

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
    setup({ dispatch, history }: { dispatch: any; history: any }): any;
  };
  reducers: {
    common: Reducer<UserModelState>;
    cleanNetworkInfo: Reducer<UserModelState>;
  };
};

const storageUserInfo = localStorage.getItem('userInfo');
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

    userRole: (localStorage.getItem('userRole') as Roles) || Roles.NetworkMember, // 进入系统的身份
    networkName: localStorage.getItem('networkName') || '', // 进入系统时的网络
    leagueName: localStorage.getItem('leagueName') || '' // 进入系统时的联盟
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
    }
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
            userAndRegister: true
          }
        });
        return true;
      } else {
        notification.error({
          message: result.message || result.error || formatMessage({ id: 'BASS_NOTIFICATION_USER_REGISTER_FAILED' }),
          top: 64,
          duration: 3
        });
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
            accessToken: result.access_token
          }
        });
        return result;
      } else {
        yield put({
          type: 'common',
          payload: {
            loginInfo: result.message || '',
            loginStatus: LoginStatus.LOGIN_ERROR
          }
        });
      }
    },
    *getUserInfo({ payload }, { call, put }) {
      const res = yield call(API.getUserInfo, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        localStorage.setItem('userInfo', JSON.stringify(result));
        localStorage.setItem('role', result.role);
        yield put({
          type: 'common',
          payload: {
            userInfo: result
          }
        });
      }
    },
    *getNetworkList({ payload }, { call, put }) {
      const res = yield call(API.getNetworkList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: { networkList: result }
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
            myNetworkList: result
          }
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
            roleToken: result.role_token
          }
        });
        localStorage.setItem('roleToken', result.role_token);
        return true;
      } else {
        notification.error({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_CONSORTIUM_UNABLE_ENTER' }),
          top: 64,
          duration: 3
        });
        return false;
      }
    },
    *enrollInLeague({ payload }, { call, put }) {
      const res = yield call(API.enrollInLeague, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({
          message: formatMessage({ id: 'BASS_NOTIFICATION_CONSORTIUM_SUCCESS' }),
          top: 64,
          duration: 3
        });
        return true;
      } else {
        notification.error({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_CONSORTIUM_ADD_FAILED' }),
          top: 64,
          duration: 3
        });
        return false;
      }
    },
    *createLeague({ payload }, { call, put }) {
      const res = yield call(API.createLeague, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({
          message: formatMessage({ id: 'BASS_NOTIFICATION_CONSORTIUM_CREATE_SUCCESS' }),
          top: 64,
          duration: 3
        });
        return true;
      } else {
        notification.error({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_CONSORTIUM_CREATE_FAILED' }),
          top: 64,
          duration: 3
        });
        return false;
      }
    }
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
    cleanNetworkInfo(state, action) {
      return {
        ...state,
        ...action.payload,
        roleToken: '',
        userRole: Roles.NetworkMember,
        networkName: '',
        leagueName: ''
      };
    }
  }
};

export default UserModel;
