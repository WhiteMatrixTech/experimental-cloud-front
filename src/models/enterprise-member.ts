import * as API from '../services/enterprise-member';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';
import { formatMessage } from 'umi';

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
  approvalStatus: string;
  isValid: string;
};

export type MemberModelState = {
  memberList: Array<EnterpriseMemberSchema>;
  memberTotal: number;
  memberDetail: EnterpriseMemberSchema | object;
  memberRole: string;
};

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
    memberRole: ''
  },

  effects: {
    *getMemberTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getMemberTotalDocs, payload);
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

    *getPageListOfCompanyMember({ payload }, { call, put }) {
      const res = yield call(API.getPageListOfCompanyMember, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            memberList: result.items
          }
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
            memberDetail: result
          }
        });
      }
    },

    *setStatusOfLeagueCompany({ payload }, { call, put }) {
      return yield call(API.setStatusOfLeagueCompany, payload);
    },

    *setCompanyApprove({ payload }, { call, put }) {
      return yield call(API.setCompanyApprove, payload);
    },

    *getMemberRole({ payload }, { call, put }) {
      const res = yield call(API.getMemberRole, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            memberRole: result?.roleName || ''
          }
        });
      }
    },

    *setRoleToMember({ payload }, { call, put }) {
      const res = yield call(API.setRoleToMember, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({
          message: formatMessage({ id: 'BASS_NOTIFICATION_ENTERPRISE_MEMBER_RIGHT_CONFIG_SUCCESS' }),
          top: 64,
          duration: 3
        });
        return true;
      } else {
        notification.error({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_ENTERPRISE_MEMBER_RIGHT_CONFIG_FAILED' }),
          top: 64,
          duration: 3
        });
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
