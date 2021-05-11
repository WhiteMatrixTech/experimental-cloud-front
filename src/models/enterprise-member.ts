import * as API from '../services/enterprise-member';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';

export type EnterpriseMemberSchema = {
  companyName: string;
  companyCertBusinessNumber: string;
  companyAddress: string;
  companyDesc: string;
  legalPersonName: string;
  legalPersonIdCardNumber: string;
  contactName: string;
  contactPhone: string;
  contactCell: string;
  contactEmail: string;
  createTimestamp: Date;
  did: string;
}

export type MemberModelState = {
  memberList: Array<EnterpriseMemberSchema>,
  memberTotal: number,
  memberDetail: EnterpriseMemberSchema | object,
  memberRole: string,
}

export type MemberModelType = {
  namespace: 'Member';
  state: MemberModelState;
  effects: {
    getMemberTotalDocs: Effect;
    getPageListOfCompanyMember: Effect;
    getMemberDetail: Effect;
    setStatusOfLeagueCompany: Effect;
    setCompanyApprove: Effect;
    getMemberRole: Effect;
    setRoleToMember: Effect;
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

    memberDetail: {},
    memberRole: '',
  },

  effects: {
    *getMemberTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getMemberTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            memberTotal: result.count,
          },
        });
      }
    },

    *getPageListOfCompanyMember({ payload }, { call, put }) {
      const res = yield call(API.getPageListOfCompanyMember, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            memberList: result.items,
          },
        });
      }
    },

    *getMemberDetail({ payload }, { call, put }) {
      const res = yield call(API.getMemberDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            memberDetail: result,
          },
        });
      }
    },

    *setStatusOfLeagueCompany({ payload }, { call, put }) {
      const res = yield call(API.setStatusOfLeagueCompany, payload);
      const { statusCode, result } = res;
      const { isValid } = payload;
      const succMessage = `${isValid === 'invalid' ? '停用' : '启用'}用户成员成功`;
      const failMessage = `${isValid === 'invalid' ? '停用' : '启用'}用户成员失败`;
      if (statusCode === 'ok' && result === 1) {
        notification.success({ message: succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
        return false;
      }
    },

    *setCompanyApprove({ payload }, { call, put }) {
      const res = yield call(API.setCompanyApprove, payload);
      const { statusCode, result } = res;
      const { approvalStatus } = payload;
      const succMessage = `${approvalStatus === 'approved' ? '通过' : '驳回'}用户成员成功`;
      const failMessage = `${approvalStatus === 'approved' ? '通过' : '驳回'}用户成员失败`;
      if (statusCode === 'ok' && result === 1) {
        notification.success({ message: succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
        return false;
      }
    },

    *getMemberRole({ payload }, { call, put }) {
      const res = yield call(API.getMemberRole, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            memberRole: result?.roleName || '',
          },
        });
      }
    },

    *setRoleToMember({ payload }, { call, put }) {
      const res = yield call(API.setRoleToMember, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '成员访问权限配置成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '成员访问权限配置失败', top: 64, duration: 3 });
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

export default MemberModel;