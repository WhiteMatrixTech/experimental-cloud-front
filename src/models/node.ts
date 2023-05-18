import * as API from '../services/node';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';

export type PeerSchema = {
  networkName: string,      // 网络名称
  orgName: string,          // 组织名称
  nodeName: string,         // 节点名称
  nodeAliasName: string,    // 节点别名
  orgFullName: string,      // 组织全名
  updatedAt: Date,          // 2021-01-29T07:26:18.934Z
  nodeIp: string,           // 节点ip
  nodePort: number,              // 节点端
  nodeStatus: string,        // 节点状态  Running
}

export type PeerModelState = {
  nodeList: Array<PeerSchema>,
  nodeTotal: number,
  nodeSSH: string,
}

export type PeerModelType = {
  namespace: 'Peer';
  state: PeerModelState;
  effects: {
    getNodeList: Effect;
    getNodeSSH: Effect;
    createNode: Effect;
    startNode: Effect;
    stopNode: Effect;
  };
  reducers: {
    common: Reducer<PeerModelState>;
  };
};

const PeerModel: PeerModelType = {
  namespace: 'Peer',

  state: {
    nodeList: [],
    nodeTotal: 0,
    nodeSSH: '',
  },

  effects: {
    *getNodeList({ payload }, { call, put }): any {
      const res = yield call(API.getNodeList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            nodeList: result,
            nodeTotal: result.length,
          },
        });
      }
    },

    *getNodeSSH({ payload }, { call, put }): any {
      const res = yield call(API.getNodeSSH, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            nodeSSH: result,
          },
        });
      }
    },

    *startNode({ payload }, { call }): any {
      const res = yield call(API.startNode, payload);
      const { statusCode } = res;
      if (statusCode === 'ok') {
        notification.success({ message: "启动节点成功", top: 64, duration: 3 })
      }else {
        notification.error({ message: "启动节点失败", top: 64, duration: 3 })
      }
    },

    *stopNode({ payload }, { call }): any {
      const res = yield call(API.stopNode, payload);
      const { statusCode } = res;
      if (statusCode === 'ok') {
        notification.success({ message: "停止节点成功", top: 64, duration: 3 })
      }else {
        notification.error({ message: "停止节点失败", top: 64, duration: 3 })
      }
    },

    *createNode({ payload }, { call, put }): any {
      const res = yield call(API.createNode, payload);
      const { statusCode, result } = res;
      const succMessage = `节点创建请求发起成功`;
      const failMessage = `节点创建请求发起失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: result.message || succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
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

export default PeerModel;
