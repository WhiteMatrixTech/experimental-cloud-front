import * as API from '../services/contract';
import { getAllUserId } from '../services/fabric-role';
import { notification } from 'antd';
import type { Reducer, Effect, ChannelSchema } from 'umi';

export type ChainCodeSchema = {
  networkName: string; // 网络名称
  channelId: string; // 通道名称
  chainCodeName: string; // 合约名称
  chainCodeVersion: string; // 合约版本
  //TODO: 使用页面处的枚举
  chainCodeStatus: string; // 合约状态
  initArgs: string; // 初始参数
  chainCodePackageMetaData: {
    // 合约包
    uri: string; // 合约包链接
    label: string; // 合约包标签
    language: string; // 合约包语言
  };
  createOrgName?: string; // 创建组织名称
  initRequired: boolean; // 是否必需
  description: string; // 合约描述
  endorsementPolicy: {
    policyType: 'Default';
    expression?: string;
    orgsToApprove: string[];
  };
  approvedOrgs: string[];
  chainCodeSequence: number; // 合约序列
  updatedAt?: Date;
};

export type ContractModelState = {
  userOrgInuse: boolean; // 用户是否有组织 且组织在使用中
  channelList: Array<ChannelSchema>; // 使用中的通道列表
  myChannelList: Array<ChannelSchema>; // 当前用户所在通道列表
  myContractList: Array<ChainCodeSchema>; // 我的合约列表
  myContractTotal: number;

  curContractDetail: {}; // 当前合约详情
  curContractVersionList: Array<object>; // 当前合约版本历史列表
  curContractVersionTotal: number;
  curVersionApprovalList: Array<object>; // 当前版本合约审批历史列表
  curVersionApprovalTotal: number;

  invokeResult: null | object;

  allUserId: Array<string>; // fabric角色用户列表
};

export type ContractModelType = {
  namespace: 'Contract';
  state: ContractModelState;
  effects: {
    getChainCodeList: Effect;
    getChainCodeTotal: Effect;
    getDetailOfChainCode: Effect;
    getChainCodeHistory: Effect;
    getChainCodeHistoryTotalDocs: Effect;
    getChainCodeApprovalHistory: Effect;
    getChainCodeApprovalHistoryTotalDocs: Effect;
    getChannelList: Effect;
    getChannelListByOrg: Effect;
    checkOrgInUse: Effect;
    addContract: Effect;
    verifyContract: Effect;
    installContract: Effect;
    upgradeContract: Effect;
    releaseContract: Effect;
    getAllUserId: Effect;
    invokeChainCodeMethod: Effect;
    queryChainCodeMethod: Effect;
  };
  reducers: {
    common: Reducer<ContractModelState>;
  };
};

const ContractModel: ContractModelType = {
  namespace: 'Contract',

  state: {
    userOrgInuse: false,
    channelList: [],
    myChannelList: [],
    myContractList: [],
    myContractTotal: 0,

    curContractDetail: {},
    curContractVersionList: [],
    curContractVersionTotal: 0,
    curVersionApprovalList: [],
    curVersionApprovalTotal: 0,

    invokeResult: null,

    allUserId: [], // fabric角色用户列表
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
          },
        });
      }
    },

    *getChainCodeTotal({ payload }, { call, put }) {
      const res = yield call(API.getChainCodeTotal, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myContractTotal: result.count,
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

    *getChannelListByOrg({ payload }, { call, put }) {
      const res = yield call(API.getChannelListByOrg, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myChannelList: result,
          },
        });
      }
    },

    *checkOrgInUse({ payload }, { call, put }) {
      const res = yield call(API.checkOrgInUse, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            userOrgInuse: result.result,
          },
        });
      }
    },

    *addContract({ payload }, { call, put }) {
      const res = yield call(API.addContract, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '新增合约成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '新增合约失败', top: 64, duration: 3 });
        return false;
      }
    },

    *verifyContract({ payload }, { call, put }) {
      const res = yield call(API.verifyContract, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '修改合约审核状态成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '修改合约审核状态失败', top: 64, duration: 3 });
        return false;
      }
    },

    *installContract({ payload }, { call, put }) {
      const res = yield call(API.installContract, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '合约安装请求调用成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '合约安装请求调用失败', top: 64, duration: 3 });
        return false;
      }
    },

    *upgradeContract({ payload }, { call, put }) {
      const res = yield call(API.upgradeContract, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '合约升级成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '合约升级失败', top: 64, duration: 3 });
        return false;
      }
    },

    *releaseContract({ payload }, { call, put }) {
      const res = yield call(API.releaseContract, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '发布合约请求调用成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '发布合约请求调用失败', top: 64, duration: 3 });
        return false;
      }
    },

    *getAllUserId({ payload }, { call, put }) {
      const res = yield call(getAllUserId, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            allUserId: result,
          },
        });
      }
    },

    *invokeChainCodeMethod({ payload }, { call, put }) {
      const res = yield call(API.invokeChainCodeMethod, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            invokeResult: {
              status: 'Success',
              message: result || {},
            },
          },
        });
        notification.success({ message: '调用合约成功', top: 64, duration: 3 });
        return true;
      } else {
        yield put({
          type: 'common',
          payload: {
            invokeResult: {
              status: 'Failed',
              message: { error: result.message },
            },
          },
        });
        notification.error({ message: result.message || '调用合约失败', top: 64, duration: 3 });
        return false;
      }
    },

    *queryChainCodeMethod({ payload }, { call, put }) {
      const res = yield call(API.queryChainCodeMethod, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            invokeResult: {
              status: 'Success',
              message: result || {},
            },
          },
        });
        notification.success({ message: '调用合约成功', top: 64, duration: 3 });
        return true;
      } else {
        yield put({
          type: 'common',
          payload: {
            invokeResult: {
              status: 'Failed',
              message: { error: result.message },
            },
          },
        });
        notification.error({ message: result.message || '调用合约失败', top: 64, duration: 3 });
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

export default ContractModel;
