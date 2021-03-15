import * as API from '../services/fabric-role';
import { notification } from 'antd';

export default {
  namespace: 'FabricRole',

  state: {
    fabricRoleList: [],
    fabricRoleTotal: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *getFabricRoleList({ payload }, { call, put }) {
      const res = yield call(API.getFabricRoleList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            fabricRoleList: result,
            fabricRoleTotal: result.length,
          },
        });
      }
    },

    *getFabricRoleListWithOrg({ payload }, { call, put }) {
      const res = yield call(API.getFabricRoleListWithOrg, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            fabricRoleList: result,
            fabricRoleTotal: result.length,
          },
        });
      }
    },

    *createFabricRole({ payload }, { call, put }) {
      const res = yield call(API.createFabricUser, payload);
      const { statusCode, result } = res;
      const succMessage = `新增Fabric角色成功`;
      const failMessage = `新增Fabric角色失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: result.message || succMessage, top: 64, duration: 1 });
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
