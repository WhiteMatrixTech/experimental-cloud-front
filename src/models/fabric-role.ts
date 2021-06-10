import * as API from '../services/fabric-role';
import { getMyOrgInfo } from '../services/my-info';
import { notification } from 'antd';
import type { Reducer, Effect, OrganizationSchema } from 'umi';
import { Roles } from '~/utils/roles';
import { FabricRole } from '~/pages/about/fabricUsers/_config';
import { formatMessage } from 'umi';

export type FabricRoleSchema = {
  networkName: string; // 网络名称
  userId: string; // 用户ID
  mspId: string; // MSP ID
  explorerRole: FabricRole; // fabric网络角色
  credentials: string; // 证书凭据
  type: string; // 证书类型
  orgName: string; // 组织名
  companyName: string; // 公司名
  networkRole: Roles; // baas网络角色
};

export type FabricRoleModelState = {
  fabricRoleList: Array<FabricRoleSchema>;
  fabricRoleTotal: number;
  myOrgInfo: OrganizationSchema | null;
};

export type FabricRoleModelType = {
  namespace: 'FabricRole';
  state: FabricRoleModelState;
  effects: {
    getFabricRoleList: Effect;
    getFabricRoleListWithOrg: Effect;
    getMyOrgInfo: Effect;
    createFabricRole: Effect;
  };
  reducers: {
    common: Reducer<FabricRoleModelState>;
  };
};

const FabricRoleModel: FabricRoleModelType = {
  namespace: 'FabricRole',

  state: {
    fabricRoleList: [],
    fabricRoleTotal: 0,

    myOrgInfo: null // 我的组织信息
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
            fabricRoleTotal: result.length
          }
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
            fabricRoleTotal: result.length
          }
        });
      }
    },

    *getMyOrgInfo({ payload }, { call, put }) {
      const res = yield call(getMyOrgInfo, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myOrgInfo: result
          }
        });
      }
    },

    *createFabricRole({ payload }, { call, put }) {
      const res = yield call(API.createFabricUser, payload);
      const { statusCode, result } = res;
      const succMessage = formatMessage({ id: 'BASS_NOTIFICATION_FABRIC_ROLE_SUCCESS' });
      const failMessage = formatMessage({ id: 'BASS_NOTIFICATION_FABRIC_ROLE_FAILED' });
      if (statusCode === 'ok' && result) {
        notification.success({ message: result.message || succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
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

export default FabricRoleModel;
