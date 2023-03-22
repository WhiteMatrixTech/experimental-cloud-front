import * as API from '../services/rbac';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';
import { UserAccessPolicy } from '~/pages/about/rbac/_config';

export type RbacRole = {
  roleName: string;
  policy: UserAccessPolicy[];
};

export type RBACModelState = {
  roleList: Array<RbacRole>;
  roleNameList: Array<string>;
  rbacPolicy: RbacRole | null;
  chaincodeList: any[];
};

export type RBACModelType = {
  namespace: 'RBAC';
  state: RBACModelState;
  effects: {
    getRoleList: Effect;
    getRoleNameList: Effect;
    getChainCodeList: Effect;
    getMyselfChainCodeList: Effect;
    createRbac: Effect;
    configRbac: Effect;
  };
  reducers: {
    common: Reducer<RBACModelState>;
  };
};

const RBACModel: RBACModelType = {
  namespace: 'RBAC',

  state: {
    roleList: [], // 角色列表
    roleNameList: [], // 角色名列表
    chaincodeList: [],
    rbacPolicy: null
  },

  effects: {
    *getRoleList({ payload }, { call, put }): any {
      const res = yield call(API.getRoleList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            roleList: result
          }
        });
        return result;
      }
    },

    *getRoleNameList({ payload }, { call, put }): any {
      const res = yield call(API.getRoleNameList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            roleNameList: result
          }
        });
        return result;
      }
    },

    *getChainCodeList({ payload }, { call, put }): any {
      const res = yield call(API.getChaincodeList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            chaincodeList: result
          }
        });
      }
    },

    *getMyselfChainCodeList({ payload }, { call, put }): any {
      const res = yield call(API.getMyselfChainCodeList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            chaincodeList: result
          }
        });
      }
    },

    *createRbac({ payload }, { call, put }): any {
      const res = yield call(API.createRbac, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '新增角色访问策略成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.msg || '新增角色访问策略失败', top: 64, duration: 3 });
        return false;
      }
    },

    *configRbac({ payload }, { call, put }): any {
      const res = yield call(API.configRbac, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '配置角色访问策略成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.msg || '配置角色访问策略失败', top: 64, duration: 3 });
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

export default RBACModel;
