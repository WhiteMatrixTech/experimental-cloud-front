import * as API from '../services/cluster';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';

export type ClusterSchema = {
  id: string;
  name: string;
  description: string;
  kubeConfig: string;
  domain?: string;
  storageClass: string;
  ordererCaCapacity?: string;
  ordererNodeCapacity?: string;
  peerCaCapacity?: string;
  peerNodeCapacity?: string;
  peerDbCapacity?: string;
  peerChaincodeCapacity?: string;
  createTime: string;
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
    modifyCluster: Effect;
    untieCluster: Effect;
  };
  subscriptions: {
    setup({ dispatch, history }: { dispatch: any; history: any }): any;
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

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }: { pathname: string }) => {
        if (pathname.includes('/selectLeague')) {
          dispatch({ type: 'getClusterList' });
        }
      });
    }
  },

  effects: {
    *getClusterList({ payload }, { call, put }): any {
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

    *createCluster({ payload }, { call }): any {
      const res = yield call(API.createCluster, payload);
      const { statusCode, result } = res;
      const succMessage = `创建集群成功`;
      const failMessage = `创建集群失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: result.message || succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.msg || failMessage, top: 64, duration: 3 });
        return false;
      }
    },

    *modifyCluster({ payload }, { call }): any {
      const res = yield call(API.modifyCluster, payload);
      const { statusCode, result } = res;
      const succMessage = `配置集群成功`;
      const failMessage = `配置集群失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: result.message || succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.msg || failMessage, top: 64, duration: 3 });
        return false;
      }
    },

    *untieCluster({ payload }, { call }): any {
      const res = yield call(API.untieCluster, payload);
      const { statusCode, result } = res;
      const succMessage = `集群解绑成功`;
      const failMessage = `集群解绑失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: result.message || succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.msg || failMessage, top: 64, duration: 3 });
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
