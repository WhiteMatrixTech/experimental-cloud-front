import * as API from '../services/member';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';
import { MemberApprovalStatus } from '~/pages/about/member/_config';

export type EnterpriseMemberSchema = {
  email: string;
  name: string;
  phoneNo: string;
  address: string;
  enterpriseName: string;
  enterpriseUsci: string;
  applicationTime: string;
  approveTime: string;
  status: MemberApprovalStatus;
  disabled: boolean;
  roleName: string;
};

export type MemberModelState = {
  memberList: Array<EnterpriseMemberSchema>;
  memberTotal: number;
  memberDetail: EnterpriseMemberSchema | object;
};

export type MemberModelType = {
  namespace: 'Member';
  state: MemberModelState;
  effects: {
    getMemberTotal: Effect;
    getMemberList: Effect;
    validateMember: Effect;
    approveMember: Effect;
    configUserRole: Effect;
  };
  reducers: {
    common: Reducer<MemberModelState>;
  };
};

const MemberModel: MemberModelType = {
  namespace: 'Member',

  state: {
    memberList: [],
    memberTotal: 0,

    memberDetail: {}
  },

  effects: {
    *getMemberTotal({ payload }, { call, put }): any {
      const res = yield call(API.getMemberTotal, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            memberTotal: result.count
          }
        });
      }
    },

    *getMemberList({ payload }, { call, put }): any {
      const res = yield call(API.getMemberList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            memberList: result
          }
        });
      }
    },

    *validateMember({ payload }, { call, put }): any {
      const res = yield call(API.validateMember, payload);
      const { statusCode, result } = res;
      const { disable } = payload;
      const succMessage = `${disable ? '停用' : '启用'}成员成功`;
      const failMessage = `${disable ? '停用' : '启用'}成员失败`;
      if (statusCode === 'ok') {
        notification.success({ message: succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.msg || failMessage, top: 64, duration: 3 });
        return false;
      }
    },

    *approveMember({ payload }, { call }): any {
      const res = yield call(API.approveMember, payload);
      const { statusCode, result } = res;
      const { passed } = payload;
      const succMessage = `${passed ? '通过' : '驳回'}成员成功`;
      const failMessage = `${passed ? '通过' : '驳回'}成员失败`;
      if (statusCode === 'ok') {
        notification.success({ message: succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.msg || failMessage, top: 64, duration: 3 });
        return false;
      }
    },

    *configUserRole({ payload }, { call, put }): any {
      const res = yield call(API.configUserRole, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '成员访问策略配置成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.mdg || '成员访问策略配置失败', top: 64, duration: 3 });
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

export default MemberModel;
