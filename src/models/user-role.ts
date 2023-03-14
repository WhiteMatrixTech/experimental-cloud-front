import * as API from '../services/user-role';
import type { Reducer, Effect, UserInfoSchema } from 'umi';
import { Roles } from '~/utils/roles';
import { notification } from 'antd';

export type UserRoleModelState = {
  userList: Array<UserInfoSchema>;
  userTotal: number;
};

export type UserRoleModelType = {
  namespace: 'UserRole';
  state: UserRoleModelState;
  effects: {
    getUserList: Effect;
    getUserTotal: Effect;
    resetPassword: Effect;
    setUserAdmin: Effect;
    unsetUserAdmin: Effect;
  };
  reducers: {
    common: Reducer<UserRoleModelState>;
  };
};

const UserRoleModel: UserRoleModelType = {
  namespace: 'UserRole',

  state: {
    userList: [],
    userTotal: 0
  },

  effects: {
    *getUserList({ payload }, { call, put }): any {
      const res = yield call(API.getUserList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        const userList = result.items.map((user: any) => {
          return {
            ...user,
            // api返回两个布尔值super、admin
            role: user.super ? Roles.SUPER : user.admin ? Roles.ADMIN : Roles.MEMBER
          };
        });
        yield put({
          type: 'common',
          payload: {
            userList
          }
        });
      }
    },

    *getUserTotal({ payload }, { call, put }): any {
      const res = yield call(API.getUserTotal, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            userTotal: result.count
          }
        });
      }
    },

    *resetPassword({ payload }, { call, put }): any {
      const res = yield call(API.resetPassword, payload);
      const { statusCode, result } = res;
      const succMessage = `密码重置成功`;
      const failMessage = `密码重置失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.msg || failMessage, top: 64, duration: 3 });
        return false;
      }
    },

    *setUserAdmin({ payload }, { call, put }): any {
      const res = yield call(API.setUserAdmin, payload);
      const { statusCode, result } = res;
      const succMessage = `设置管理员成功`;
      const failMessage = `设置管理员失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.msg || failMessage, top: 64, duration: 3 });
        return false;
      }
    },

    *unsetUserAdmin({ payload }, { call, put }): any {
      const res = yield call(API.unsetUserAdmin, payload);
      const { statusCode, result } = res;
      const succMessage = `设置为普通用户成功`;
      const failMessage = `设置为普通用户失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.msg || failMessage, top: 64, duration: 3 });
        return false;
      }
    }
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    }
  }
};

export default UserRoleModel;
