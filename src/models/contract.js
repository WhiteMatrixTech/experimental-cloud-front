import * as API from '../services/contract.js';
import { notification } from 'antd';

export default {
  namespace: 'Contract',

  state: {
    channelList: [], // 创建合约通道下拉框列表
    orgListWithChannel: [], // 创建合约组织下拉框列表
    myContractList: [], // 我的合约列表
    myContractTotal: 0,

    curContractDetail: {}, // 当前合约详情
    curContractVersionList: [], // 当前合约版本历史列表
    curContractVersionTotal: 0,
    curVersionApprovalList: [], // 当前版本合约审批历史列表
    curVersionApprovalTotal: 0,

    strategyList: [], // 隐私保护策略列表
    strategyTotal: 0,

    strategyMemberList: [],// 关联成员列表
    leagueName: '',        //联盟名称
    curStrategyMember: [], // 当前策略已关联成员

    protectRecordList: [], // 隐私保护记录列表
    protectRecordTotal: 0,

    repositoryList: [], // 合约仓库列表
    repositoryTotal: 0,
    curRepository: {}, // 当前合约仓库信息
    repositoryDetailList: [], // 合约仓库详情列表
    repositoryDetailTotal: 0,
    fieldDescList: [], // 字段说明列表
    fieldDescTotal: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) { },
  },

  effects: {
    *getChainCodeList({ payload }, { call, put }) {
      const res = yield call(API.getChainCodeList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myContractList: result.items,
            myContractTotal: result.length
          },
        });
      }
    },
    *getDetailOfChainCode({ payload }, { call, put }) {
      const res = yield call(API.getDetailOfChainCode, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            curContractDetail: result,
          },
        });
      }
    },
    *getChainCodeHistory({ payload }, { call, put }) {
      const res = yield call(API.getChainCodeHistory, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            curContractVersionList: result.items,
          },
        });
      }
    },
    *getChainCodeHistoryTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getChainCodeHistoryTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            curContractVersionTotal: result,
          },
        });
      }
    },
    *getChainCodeApprovalHistory({ payload }, { call, put }) {
      const res = yield call(API.getChainCodeApprovalHistory, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            curVersionApprovalList: result.items,
          },
        });
      }
    },
    *getChainCodeApprovalHistoryTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getChainCodeApprovalHistoryTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            curVersionApprovalTotal: result,
          },
        });
      }
    },
    *setChainCodeApproveReject({ payload }, { call, put }) {
      const res = yield call(API.setChainCodeApproveReject, payload);
      const { statusCode, result } = res;
      const { chainCodeStatus } = payload;
      const succMessage = `${chainCodeStatus === 4 ? '通过' : '驳回'}合约成功`;
      const failMessage = `${chainCodeStatus === 4 ? '通过' : '驳回'}合约失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: res.message || failMessage, top: 64, duration: 1 });
      }
    },
    *getChannelList({ payload }, { call, put }) {
      const res = yield call(API.getChannelList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            channelList: result,
          },
        });
      }
    },
    *getOrgListWithChannel({ payload }, { call, put }) {
      const res = yield call(API.getOrgListWithChannel, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            orgListWithChannel: result.items,
          },
        });
      }
    },
    *addContract({ payload }, { call, put }) {
      const res = yield call(API.addContract, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result) {
        notification.success({ message: '新增合约成功', top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: res.message || '新增合约失败', top: 64, duration: 1 });
      }
    },
    *upgrateContract({ payload }, { call, put }) {
      const res = yield call(API.upgrateContract, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result) {
        notification.success({ message: '合约升级成功', top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: res.message || '合约升级失败', top: 64, duration: 1 });
      }
    },
    *releaseContract({ payload }, { call, put }) {
      const res = yield call(API.releaseContract, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result) {
        notification.success({ message: '发布合约成功', top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: res.message || '发布合约失败', top: 64, duration: 1 });
      }
    },
    *getPageListOfRoleData({ payload }, { call, put }) {
      const res = yield call(API.getPageListOfRoleData, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            strategyList: result.items,
          },
        });
      }
    },
    *getRoleDateTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getRoleDateTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            strategyTotal: result,
          },
        });
      }
    },
    *createAndUpdateStrategy({ payload }, { call, put }) {
      const res = yield call(API.createAndUpdateStrategy, payload);
      const { statusCode, result } = res;
      const succMessage = `新增隐私保护策略成功`;
      const failMessage = `新增隐私保护策略失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 1 });
        return true;
      } else if (res.statusCode === 400 && res.message.indexOf('E11000') != -1) {
        notification.error({ message: 'Duplicate Key Error' || failMessage, top: 64, duration: 1 });
      } else {
        notification.error({ message: res.message || failMessage, top: 64, duration: 1 });
      }
    },

    *modifyAndUpdateStrategy({ payload }, { call, put }) {
      const res = yield call(API.modifyAndUpdateStrategy, payload);
      const { statusCode, result } = res;
      const succMessage = `修改隐私保护策略成功`;
      const failMessage = `修改隐私保护策略失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: res.message || failMessage, top: 64, duration: 1 });
      }
    },
    *updateStrategyStatus({ payload }, { call, put }) {
      const res = yield call(API.updateStrategyStatus, payload);
      const { statusCode, result } = res;
      const { strategyStatus } = payload;
      const succMessage = `${strategyStatus === 0 ? '停用' : '启用'}隐私保护策略成功`;
      const failMessage = `${strategyStatus === 0 ? '停用' : '启用'}隐私保护策略失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: succMessage, top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: res.message || failMessage, top: 64, duration: 1 });
      }
    },
    *getPageListOfRoleMember({ payload }, { call, put }) {
      const res = yield call(API.getPageListOfRoleMember, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            strategyMemberList: result.strategyConfig,
            leagueName: result.leagueName,
          },
        });
      }
    },
    *updateStrategyMember({ payload }, { call, put }) {
      const res = yield call(API.updateStrategyMember, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result) {
        notification.success({ message: '配置隐私保护策略成功', top: 64, duration: 1 });
        yield put({
          type: 'common',
          payload: {},
        });
        return true;
      } else {
        notification.error({
          message: res.message || '配置隐私保护策略失败',
          top: 64,
          duration: 1,
        });
      }
    },
    *getPageListOfRecord({ payload }, { call, put }) {
      const res = yield call(API.getPageListOfRecord, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            protectRecordList: result.validMembers,
            protectRecordTotal: result.strategyMember.strategyMember,
          },
        });
      }
    },
    *getRepositoryListOfChainCode({ payload }, { call, put }) {
      const res = yield call(API.getRepositoryListOfChainCode, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            repositoryList: result.list,
            repositoryTotal: result.totalDocs,
          },
        });
      }
    },
    *getStoreSupplyListOfChainCode({ payload }, { call, put }) {
      const res = yield call(API.getStoreSupplyListOfChainCode, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            repositoryDetailList: result.list,
            repositoryDetailTotal: result.totalDocs,
          },
        });
      }
    },
    *getStoreSupplyExplainListOfChainCode({ payload }, { call, put }) {
      const res = yield call(API.getStoreSupplyExplainListOfChainCode, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            fieldDescList: result.list,
            fieldDescTotal: result.totalDocs,
          },
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
