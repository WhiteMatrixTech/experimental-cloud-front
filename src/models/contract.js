import * as API from 'services/contract.js';
import { notification } from 'antd';

export default {
  namespace: 'Contract',

  state: {
    myContractList: [], // 我的合约列表
    myContractTotal: 0,

    curContractDetail: {}, // 当前合约详情
    curContractVersionList: [], // 当前合约版本历史列表
    curContractVersionTotal: 0,
    curVersionApprovalList: [], // 当前版本合约审批历史列表
    curVersionApprovalTotal: 0,

    strategyList: [], // 隐私保护策略列表
    strategyTotal: 0,

    strategyMemberList: [], // 关联成员列表
    curStrategyMember: [], // 当前策略已关联成员

    protectRecordList: [], // 隐私保护记录列表
    protectRecordTotal: 0,

    repositoryList: [], // 合约仓库列表
    repositoryTotal: 0,
    curRepository: {}, // 当前合约仓库信息
    repositoryDetailList: [], // 合约仓库详情列表
    repositoryDetailTotal: 0,
    fieldDescList: [], // 字段说明列表
    fieldDescTotal: 0
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *getPageListOfChainCode({ payload }, { call, put }) {
      const res = yield call(API.getPageListOfChainCode, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myContractList: result.list,
            myContractTotal: result.totalDocs
          }
        });
      }
    },
    *getDetailOfChainCode({ payload }, { call, put }) {
      const res = yield call(API.getDetailOfChainCode, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            curContractDetail: result
          }
        });
      }
    },
    *getChainCodeHistory({ payload }, { call, put }) {
      const res = yield call(API.getChainCodeHistory, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            curContractVersionList: result.list,
            curContractVersionTotal: result.totalDocs
          }
        });
      }
    },
    *getChainCodeApprovalHistory({ payload }, { call, put }) {
      const res = yield call(API.getChainCodeApprovalHistory, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            curVersionApprovalList: result.list,
            curVersionApprovalTotal: result.totalDocs
          }
        });
      }
    },
    *setChainCodeApproveReject({ payload }, { call, put }) {
      const res = yield call(API.setChainCodeApproveReject, payload)
      const { status, result } = res;
      const { chainCodeStatus } = payload;
      const succMessage = `${chainCodeStatus === 4 ? '通过' : '驳回'}合约成功`;
      const failMessage = `${chainCodeStatus === 4 ? '通过' : '驳回'}合约失败`;
      if (status === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 1 })
        return true
      } else {
        notification.error({ message: res.message || failMessage, top: 64, duration: 1 })
      }
    },
    *addContract({ payload }, { call, put }) {
      const res = yield call(API.addContract, payload)
      const { status, result } = res;
      const { type } = payload;
      const succMessage = `${type === 1 ? '新增' : '修改'}合约成功`;
      const failMessage = `${type === 2 ? '新增' : '修改'}合约失败`;
      if (status === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 1 })
        return true
      } else {
        notification.error({ message: res.message || failMessage, top: 64, duration: 1 })
      }
    },
    *getPageListOfRoleData({ payload }, { call, put }) {
      const res = yield call(API.getPageListOfRoleData, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            strategyList: result.list,
            strategyTotal: result.totalDocs
          }
        });
      }
    },
    *createAndUpdateStrategy({ payload }, { call, put }) {
      const res = yield call(API.createAndUpdateStrategy, payload)
      const { status, result } = res;
      const succMessage = `${payload.id ? '修改' : '新增'}隐私保护策略成功`;
      const failMessage = `${payload.id ? '修改' : '新增'}隐私保护策略失败`;
      if (status === 'ok' && result.msg === '成功') {
        notification.success({ message: succMessage, top: 64, duration: 1 })
        return true
      } else {
        notification.error({ message: res.message || failMessage, top: 64, duration: 1 })
      }
    },
    *updateStrategyStatus({ payload }, { call, put }) {
      const res = yield call(API.updateStrategyStatus, payload)
      const { status, result } = res;
      const { strategyStatus } = payload;
      const succMessage = `${strategyStatus === 0 ? '停用' : '启用'}隐私保护策略成功`;
      const failMessage = `${strategyStatus === 0 ? '停用' : '启用'}隐私保护策略失败`;
      if (status === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 1 })
        return true
      } else {
        notification.error({ message: res.message || failMessage, top: 64, duration: 1 })
      }
    },
    *getPageListOfRoleMember({ payload }, { call, put }) {
      const res = yield call(API.getPageListOfRoleMember, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            strategyMemberList: result.validMembers,
            curStrategyMember: result.strategyMember.strategyMember
          }
        });
      }
    },
    *updateStrategyMember({ payload }, { call, put }) {
      const res = yield call(API.updateStrategyMember, payload)
      const { status, result } = res;
      if (status === 'ok' && result) {
        notification.success({ message: '配置隐私保护策略成功', top: 64, duration: 1 })
        yield put({
          type: 'common',
          payload: {
            curStrategyMember: result.strategyMember
          }
        })
        return true
      } else {
        notification.error({ message: res.message || '配置隐私保护策略失败', top: 64, duration: 1 })
      }
    },
    *getPageListOfRecord({ payload }, { call, put }) {
      const res = yield call(API.getPageListOfRecord, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            protectRecordList: result.validMembers,
            protectRecordTotal: result.strategyMember.strategyMember
          }
        });
      }
    },
    *getRepositoryListOfChainCode({ payload }, { call, put }) {
      const res = yield call(API.getRepositoryListOfChainCode, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            repositoryList: result.list,
            repositoryTotal: result.totalDocs
          }
        });
      }
    },
    *getStoreSupplyListOfChainCode({ payload }, { call, put }) {
      const res = yield call(API.getStoreSupplyListOfChainCode, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            repositoryDetailList: result.list,
            repositoryDetailTotal: result.totalDocs
          }
        });
      }
    },
    *getStoreSupplyExplainListOfChainCode({ payload }, { call, put }) {
      const res = yield call(API.getStoreSupplyExplainListOfChainCode, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            fieldDescList: result.list,
            fieldDescTotal: result.totalDocs
          }
        });
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
