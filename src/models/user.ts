import * as API from '../services/user';
import { notification } from 'antd';
import { Roles } from '../utils/roles';
import LoginStatus from '../utils/loginStatus';
import type { Reducer, Effect } from 'umi';
import { NetworkStatus } from '~/utils/networkStatus';
import { LOCAL_STORAGE_ITEM_KEY } from '~/utils/const';
import { deviceId, encryptData, getInitData } from '~/utils/encryptAndDecrypt';

export type UserInfoSchema = {
  email: string;
  name: string;
  phoneNo: string;
  address: string;
  enterpriseName: string;
  enterpriseUsci: string;
  role: Roles;
  createTime: string;
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

  notJointedNetworkList: Array<LeagueSchema>;
  myCreatedNetworkList: Array<LeagueSchema>;
  myJoinedNetworkList: Array<LeagueSchema>;

  userRole: Roles;
  networkName: string;
  leagueName: string;
};

export type UserModelType = {
  namespace: 'User';
  state: UserModelState;
  effects: {
    register: Effect;
    changePassword: Effect;
    login: Effect;
    getUserInfo: Effect;
    getNotJointedNetworkList: Effect;
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

const { userInfo, userRole, networkName, leagueName } = getInitData();

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

    notJointedNetworkList: [], // 未加入的网络列表
    myCreatedNetworkList: [],
    myJoinedNetworkList: [],

    userRole: userRole as Roles, // 进入系统的身份
    networkName: networkName, // 进入系统时的网络
    leagueName: leagueName // 进入系统时的联盟
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }: { pathname: string }) => {
        if (pathname.includes('/selectLeague')) {
          dispatch({ type: 'getUserInfo' });
        }
      });
    }
  },

  effects: {
    *register({ payload }, { call, put }) {
      const res = yield call(API.register, payload);
      const { statusCode, result } = res;

      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            cacheAccount: payload,
            userAndRegister: true
          }
        });
        return true;
      } else {
        notification.error({ message: result.msg || '用户注册失败', top: 64, duration: 3 });
        return false;
      }
    },

    *changePassword({ payload }, { call, put }) {
      const res = yield call(API.changePassword, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            cacheAccount: result,
            userAndRegister: true
          }
        });
        return true;
      } else {
        notification.error({ message: result.message || result.error || '密码修改失败', top: 64, duration: 3 });
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
            loginInfo: result.msg || '',
            loginStatus: LoginStatus.LOGIN_ERROR
          }
        });
      }
    },

    *getUserInfo({ payload }, { call, put }) {
      const res = yield call(API.getUserInfo, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        const userInfo = {
          ...result,
          // api返回两个布尔值super、admin
          role: result.super ? Roles.SUPER : result.admin ? Roles.ADMIN : Roles.MEMBER
        };
        localStorage.setItem(LOCAL_STORAGE_ITEM_KEY.USER_INFO, encryptData(JSON.stringify(userInfo), deviceId));

        localStorage.setItem(LOCAL_STORAGE_ITEM_KEY.USER_ROLE, encryptData(userInfo.role, deviceId));
        yield put({
          type: 'common',
          payload: {
            userInfo
          }
        });
      }
    },

    *getNotJointedNetworkList({ payload }, { call, put }) {
      const res = yield call(API.getNotJointedNetworkList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: { notJointedNetworkList: result }
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
            myCreatedNetworkList: result.filter((league: LeagueSchema) => league.role === Roles.ADMIN),
            myJoinedNetworkList: result.filter((league: LeagueSchema) => league.role === Roles.MEMBER)
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
        localStorage.setItem(LOCAL_STORAGE_ITEM_KEY.ROLE_TOKEN, encryptData(result.role_token, deviceId));

        return true;
      } else {
        notification.error({ message: result.message || '无法进入联盟', top: 64, duration: 3 });
        return false;
      }
    },

    *enrollInLeague({ payload }, { call, put }) {
      const res = yield call(API.enrollInLeague, payload);
      const { statusCode, result } = res;
      const { message } = result;
      if (statusCode === 'ok') {
        if (message.includes('enroll again')) {
          notification.warn({ message: '已申请过加入联盟，请等待盟主审批，勿重复申请', top: 64, duration: 3 });
        } else {
          notification.success({ message: '已成功申请加入联盟，请等待盟主审批', top: 64, duration: 3 });
        }
        return true;
      } else {
        notification.error({ message: message || '申请加入联盟失败', top: 64, duration: 3 });
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
        userRole: Roles.MEMBER,
        networkName: '',
        leagueName: ''
      };
    }
  }
};

export default UserModel;
