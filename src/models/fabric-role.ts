import * as API from '../services/fabric-role';
import { getMyOrgInfo } from '../services/my-info';
import { notification } from 'antd';
import type { Reducer, Effect, OrganizationSchema, ChannelSchema } from 'umi';
import { getMyAccessibleOrgs } from '../services/fabric-role';

export type FabricRoleSchema = {
  orgName?: string;
  roleType: "peer" | "client" | "orderer" | "admin",
  networkName?: string;
  username?: string;
  attrs?: string;
  createTime?: string;
};

export type FabricRoleModelState = {
  fabricRoleList: Array<FabricRoleSchema>;
  fabricRoleTotal: number;
  myOrgInfo: OrganizationSchema | null;
  myAccessibleOrgs: Array<string>;
  currentRoleChannelList: ChannelSchema[]
};

export type FabricRoleModelType = {
  namespace: 'FabricRole';
  state: FabricRoleModelState;
  effects: {
    getFabricRoleList: Effect;
    getFabricRoleListWithOrg: Effect;
    getMyOrgInfo: Effect;
    getMyAccessibleOrgs: Effect;
    createFabricRole: Effect;
    getCurrentRoleChannelList: Effect;
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

    myOrgInfo: null, // 我的组织信息
    myAccessibleOrgs: [],
    currentRoleChannelList: []
  },

  effects: {
    *getFabricRoleList({ payload }, { call, put }): any {
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

    *getCurrentRoleChannelList({ payload }, { call, put }): any {
      if (!payload.org) {
        yield put({
          type: 'common',
          payload: {
            currentRoleChannelList: []
          }
        });
        return
      }
      const res = yield call(API.getCurrentRoleChannelList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            currentRoleChannelList: result
          }
        });
      }
    },

    *getFabricRoleListWithOrg({ payload }, { call, put }): any {
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

    *getMyOrgInfo({ payload }, { call, put }): any {
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

    *getMyAccessibleOrgs({ payload }, { call, put }): any {
      const res = yield call(getMyAccessibleOrgs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myAccessibleOrgs: result
          }
        });
      }
    },

    *createFabricRole({ payload }, { call }): any {
      const res = yield call(API.createFabricUser, payload);
      const { statusCode, result } = res;
      const succMessage = `新增Fabric角色成功`;
      const failMessage = `新增Fabric角色失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: result.message || result.msg || succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || result.msg || failMessage, top: 64, duration: 3 });
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
