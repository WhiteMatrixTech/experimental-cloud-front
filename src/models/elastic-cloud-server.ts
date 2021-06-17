import * as API from '../services/elastic-cloud-server';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';
import { formatMessage } from 'umi';

export type ElasticServerSchema = {
  serverName: string;
  //TODO: 使用页面处的枚举
  serverPurpose: string;
  publicIp: string;
  privateIp: string;
  username: string;
  publicKey: string;
  privateKey: string;
  createdAt: Date;
  instanceCount: number;
};

export enum InstanceType {
  OneCpuOneGBMem = 'OneCpuOneGBMem',
  Other = 'OTHER'
}
export class Ports {
  caPort?: number;
  nodePort?: number;
  metricsPort?: number;
  chainCodePort?: number;
  gossipPeerPort?: number;
}

export type ServerInstanceSchema = {
  serverName: string;
  instanceName: string;
  //TODO: 使用页面处的枚举
  instancePurpose: string;
  keyName: string;
  createdAt: Date;
  networkName: string;
  instanceId: string;
  instanceType: InstanceType;
  state: string;
  publicIpAddress: string;
  ports: Ports;
};

export type ElasticServerModelState = {
  serverList: Array<ElasticServerSchema>;
  serverTotal: number;
  nodeList: Array<ServerInstanceSchema>;
  nodeTotal: number;
};

export type ElasticServerModelType = {
  namespace: 'ElasticServer';
  state: ElasticServerModelState;
  effects: {
    getServerList: Effect;
    getServerTotal: Effect;
    createServer: Effect;
    modifyServer: Effect;
    deleteServer: Effect;
    getNodeList: Effect;
    getNodeTotal: Effect;
  };
  reducers: {
    common: Reducer<ElasticServerModelState>;
  };
};

const ElasticServerModel: ElasticServerModelType = {
  namespace: 'ElasticServer',

  state: {
    serverList: [],
    serverTotal: 0,

    nodeList: [],
    nodeTotal: 0
  },

  effects: {
    *getServerList({ payload }, { call, put }) {
      const res = yield call(API.getServerList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            serverList: result.items
          }
        });
      }
    },

    *getServerTotal({ payload }, { call, put }) {
      const res = yield call(API.getServerTotal, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            serverTotal: result.count
          }
        });
      }
    },

    *createServer({ payload }, { call, put }) {
      const res = yield call(API.createServer, payload);
      const { statusCode, result } = res;
      const succMessage = formatMessage({ id: 'BASS_NOTIFICATION_ELASTIC_CLOUD_SERVER_CREATE_SUCCESS' });
      const failMessage = formatMessage({ id: 'BASS_NOTIFICATION_ELASTIC_CLOUD_SERVER_CREATE_FAILED' });
      if (statusCode === 'ok' && result) {
        notification.success({ message: result.message || succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
        return false;
      }
    },

    *modifyServer({ payload }, { call, put }) {
      const res = yield call(API.modifyServer, payload);
      const { statusCode, result } = res;
      const succMessage = formatMessage({ id: 'BASS_NOTIFICATION_ELASTIC_CLOUD_SERVER_MODIFY_SUCCESS' });
      const failMessage = formatMessage({ id: 'BASS_NOTIFICATION_ELASTIC_CLOUD_SERVER_MODIFY_FAILED' });
      if (statusCode === 'ok' && result) {
        notification.success({ message: result.message || succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
        return false;
      }
    },

    *deleteServer({ payload }, { call, put }) {
      const res = yield call(API.deleteServer, payload);
      const { statusCode, result } = res;
      const succMessage = formatMessage({ id: 'BASS_NOTIFICATION_ELASTIC_CLOUD_SERVER_DELETE_SUCCESS' });
      const failMessage = formatMessage({ id: 'BASS_NOTIFICATION_ELASTIC_CLOUD_SERVER_DELETE_FAILED' });
      if (statusCode === 'ok' && result) {
        notification.success({ message: result.message || succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
        return false;
      }
    },

    *getNodeList({ payload }, { call, put }) {
      const res = yield call(API.getNodeList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            nodeList: result.items
          }
        });
      }
    },

    *getNodeTotal({ payload }, { call, put }) {
      const res = yield call(API.getNodeTotal, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            nodeTotal: result.count
          }
        });
      }
    }
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    }
  }
};

export default ElasticServerModel;
