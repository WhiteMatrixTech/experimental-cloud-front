import * as API from '../services/user-role';
import type { Reducer, Effect } from 'umi';
import { notification } from 'antd';
import { Roles } from '@/utils/roles';

export type UserRoleObject = {
  networkName: string,
  roleName: string
}
export type User = {
  loginName: string,
  companyName: string,
  contactEmail: string,
  contactName: string,
  role: Roles,
  createTimeStamp: string
}

export type UserRoleModelState = {
  userList: Array<User>,
  userTotal: number,
  roleNameList: string[],
  userRoles: UserRoleObject[]
}

export type UserRoleModelType = {
  namespace: 'UserRole';
  state: UserRoleModelState;
  effects: {
    getUserList: Effect;
    getUserTotal: Effect;
    getRoleNameList: Effect;
    getUserRoles: Effect;
    configUserRoles: Effect;
  };
  reducers: {
    common: Reducer<UserRoleModelState>;
  };
};

const UserRoleModel: UserRoleModelType = {
  namespace: 'UserRole',

  state: {
    userList: [], // 用户列表
    userTotal: 0,
    roleNameList: ['string1', 'string2', 'string3'],
    userRoles: [{
      networkName: 'string1',
      roleName: 'string1'
    }, {
      networkName: 'string2',
      roleName: 'string2'
    }, {
      networkName: 'string3',
      roleName: 'string3'
    }]
  },

  effects: {
    *getUserList({ payload }, { call, put }) {
      const res = yield call(API.getUserList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            userList: result,
          },
        });
      }
    },

    *getUserTotal({ payload }, { call, put }) {
      const res = yield call(API.getUserTotal, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            userTotal: result.count,
          },
        });
      }
    },

    *getUserRoles({ payload }, { call, put }) {
      const res = yield call(API.getUserRoles, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            userRoles: result,
          },
        });
      }
    },

    *getRoleNameList({ payload }, { call, put }) {
      const res = yield call(API.getRoleNameList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            roleNameList: result,
          },
        });
      }
    },

    *configUserRoles({ payload }, { call, put }) {
      const res = yield call(API.configUserRoles, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: result.message || '用户角色配置成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '用户角色配置失败', top: 64, duration: 3 });
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

export default UserRoleModel;
