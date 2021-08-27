import * as API from '../services/ipfs';
import { notification } from 'antd';


const IpfsModel = {
  namespace: 'Ipfs',

  state: {
    pathHash: '',
    ipfsList: [],
    stat: {},
    downloadFileRs: [],
    folderHash: ''
  },
  effects: {
    *getPathHash({ payload }, { call, put }) {
      const res = yield call(API.getPathHash, payload);
      const { statusCode, result } = res;
      console.log('result1', result)
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            stat: result,
          },
        });
      }
    },
    *getIpfsList({ payload }, { call, put }) {
      const res = yield call(API.getIpfsList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            ipfsList: result,
          },
        });
      }
    },

    *rename({ payload }, { call, put }) {
      const res = yield call(API.rename, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
        });
        notification.success({ message: '重命名成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: '重命名失败', top: 64, duration: 3 });
        return false;
      }
    },
    *delateFile({ payload }, { call, put }) {
      const res = yield call(API.delateFile, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',

        });
        notification.success({ message: '删除成功', top: 64, duration: 3 });
      }
    },

    *downloadFile({ payload }, { call, put }) {
      const res = yield call(API.downloadFile, payload);
      const { statusCode, result } = res;
      console.log('buff', result)
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            downloadFileRs: result,

          },
        });
      }
    },
    *newFolder({ payload }, { call, put }) {
      const res = yield call(API.newFolder, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',

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

export default IpfsModel;
