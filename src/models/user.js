import * as API from 'services/user.js';
import { notification } from 'antd';
import LoginStatus from 'utils/loginStatus';

export default {
  namespace: 'User',

  state: {
    userInfo: {},
    accessToken: '',
    loginInfo: '',
    loginStatus: '',
    cacheAccount: {}, // 当前注册的账户
    userAndregister: false, // 控制注册成功后的自动跳转

    networkName: 'DFI'
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *register({ payload }, { call, put }) {
      const res = yield call(API.register, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result.success) {
        notification.success({ message: '注册成功!', top: 64, duration: 1 })
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
        //TODO 登录成功后在此处设置cookie和localstorage, 然后return ture,页面会自动跳转至选择联盟界面
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
            loginInfo: res.message || '',
            loginStatus: LoginStatus.loginError
          }
        });
      }
    },
    *loginout({ payload }, { call, put }) {
      const res = yield call(API.loginout, payload)
      const { statusCode } = res;
      if (statusCode === 'ok') {
        //TODO 登出成功后在此处清除cookie和localstorage, 然后return ture,页面会自动跳转至选择联盟界面
        return true
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
}