import * as API from '../services/user.js';
import { notification } from 'antd';
import { Roles } from 'utils/roles.js';
import LoginStatus from '../utils/loginStatus';

const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};

export default {
  namespace: 'User',

  state: {
    userInfo: userInfo,
    accessToken: '', // 登录token
    roleToken: '', // 角色token 
    loginInfo: '',
    loginStatus: '',
    cacheAccount: {}, // 当前注册的账户
    userAndregister: false, // 控制注册成功后的自动跳转

    networkList: [], // 网络列表
    myNetworkList: [], // 我的网络列表

    userRole: localStorage.getItem('userRole') || Roles.NetworkMember, // 进入系统的身份
    networkName: localStorage.getItem('networkName') || 'network1' // 进入系统时的网络
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname.indexOf('/selectLeague') > -1) {
          dispatch({ type: 'getUserInfo' }); // 优先级
          dispatch({ type: 'getNetworkList' });
          dispatch({ type: 'getMyNetworkList' });
        }
      });
    },
  },

  effects: {
    *register({ payload }, { call, put }) {
      const res = yield call(API.register, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result.success) {
        yield put({
          type: 'common',
          payload: {
            cacheAccount: result,
            userAndregister: true,
          }
        });
      } else {
        notification.error({ message: result.message || '用户注册失败', top: 64, duration: 1 })
        return false
      }
    },
    *login({ payload }, { call, put }) {
      const res = yield call(API.login, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result.access_token) {
        yield put({
          type: 'common',
          payload: {
            userInfo: payload,
            accessToken: result.access_token
          }
        });
        localStorage.setItem('accessToken', result.access_token);
        return true
      } else {
        yield put({
          type: 'common',
          payload: {
            loginInfo: result.message || '',
            loginStatus: LoginStatus.loginError
          }
        });
      }
    },
    *getUserInfo({ payload }, { call, put }) {
      const res = yield call(API.getUserInfo, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        localStorage.setItem('userInfo', JSON.stringify(result))
        yield put({
          type: 'common',
          payload: {
            userInfo: result,
          }
        });
      }
    },
    *loginout({ payload }, { call, put }) {
      const res = yield call(API.loginout, payload)
      const { statusCode } = res;
      if (statusCode === 'ok') {
        return true
      }
    },
    *getNetworkList({ payload }, { call, put }) {
      const res = yield call(API.getNetworkList, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        const networkList = result.map(item => {
          item.networkName = item._id;
          return item
        })
        yield put({
          type: 'common',
          payload: { networkList }
        });
      }
    },
    *getMyNetworkList({ payload }, { call, put }) {
      const res = yield call(API.getMyNetworkList, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myNetworkList: result,
          }
        });
      }
    },
    *enterNetwork({ payload }, { call, put }) {
      const res = yield call(API.enterNetwork, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result.role_token) {
        yield put({
          type: 'common',
          payload: {
            roleToken: result.role_token
          }
        });
        localStorage.setItem('roleToken', result.role_token);
        return true
      }
    },
    *joinNetwork({ payload }, { call, put }) {
      const res = yield call(API.joinNetwork, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '加入联盟成功', top: 64, duration: 1 });
        localStorage.setItem('userRole', result.role);
        localStorage.setItem('networkName', result.networkName);
        yield put({
          type: 'common',
          payload: {
            userRole: result.role,
            networkName: result.networkName,
          }
        });
        return true;
      } else {
        notification.error({ message: result.message || '加入联盟失败', top: 64, duration: 1 })
      }
    },
    *createNetwork({ payload }, { call, put }) {
      const res = yield call(API.createNetwork, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {

      } else {
        notification.error({ message: result.message || '网络创建失败', top: 64, duration: 1 })
        return false
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
}