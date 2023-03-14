import * as API from '../services/cluster';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';

export type ClusterSchema = {
  id: string;
  name: string;
  description: string;
  kubeConfig: string;
  createTime: Date;
};

export type ClusterModelState = {
  clusterList: Array<ClusterSchema>;
  clusterTotal: number;
};

export type ClusterModelType = {
  namespace: 'Cluster';
  state: ClusterModelState;
  effects: {
    getClusterList: Effect;
    createCluster: Effect;
    untieCluster: Effect;
  };
  reducers: {
    common: Reducer<ClusterModelState>;
  };
};

const ClusterModel: ClusterModelType = {
  namespace: 'Cluster',

  state: {
    clusterList: [],
    clusterTotal: 0
  },

  effects: {
    *getClusterList({ payload }, { call, put }) {
      const res = yield call(API.getClusterList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            clusterList: result,
            clusterTotal: result?.length
          }
        });
      }
    },

    *createCluster({ payload }, { call, put }) {
      const res = yield call(API.createCluster, payload);
      const { statusCode, result } = res;
      const succMessage = `创建集群成功`;
      const failMessage = `创建集群失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: result.message || succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
        return false;
      }
    },

    *untieCluster({ payload }, { call, put }) {
      const res = yield call(API.untieCluster, payload);
      const { statusCode, result } = res;
      const succMessage = `集群解绑成功`;
      const failMessage = `集群解绑失败`;
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

export default ClusterModel;