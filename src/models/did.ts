import * as API from '../services/did';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';
import { formatMessage } from 'umi';

export type DidSchema = {
  did: string;
  idType: string;
  idName: string;
  role: string;
  additionalAttributes: Record<string, unknown>;
};

export type DIDModelState = {
  didList: Array<DidSchema>;
  didTotal: number;
  didDetail: DidSchema | null;
};

export type DIDModelType = {
  namespace: 'DID';
  state: DIDModelState;
  effects: {
    getDidList: Effect;
    getDetailByDid: Effect;
    createDID: Effect;
    modifyDID: Effect;
    deleteDID: Effect;
  };
  reducers: {
    common: Reducer<DIDModelState>;
  };
};

const DIDModel: DIDModelType = {
  namespace: 'DID',

  state: {
    didList: [],
    didTotal: 0,

    didDetail: null
  },

  effects: {
    *getDidList({ payload }, { call, put }) {
      const res = yield call(API.getDidList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            didList: result.records || [],
            didTotal: result.records ? result.records.length : 0
          }
        });
      } else {
        notification.error({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_DID_QUERY_FAILED' }),
          top: 64,
          duration: 3
        });
      }
    },

    *getDetailByDid({ payload }, { call, put }) {
      const res = yield call(API.getDetailByDid, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            didDetail: result,
            didList: [result],
            didTotal: 1
          }
        });
      } else {
        notification.error({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_DID_QUERY_FAILED' }),
          top: 64,
          duration: 3
        });
      }
    },

    *createDID({ payload }, { call, put }) {
      const res = yield call(API.createDID, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_DID_NEW_SUCCESS' }),
          top: 64,
          duration: 3
        });
        return true;
      } else {
        if (result.message && result.message.indexOf('didchannel') > -1) {
          notification.error({
            message: formatMessage({ id: 'BASS_NOTIFICATION_DID_CREATE_DIDCHANNEL' }),
            top: 64,
            duration: 3
          });
        } else {
          notification.error({
            message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_DID_CREATED_FAILED' }),
            top: 64,
            duration: 3
          });
        }
        return false;
      }
    },

    *modifyDID({ payload }, { call, put }) {
      const res = yield call(API.modifyDID, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_DID_MODIFY_SUCCESS' }),
          top: 64,
          duration: 3
        });
        return true;
      } else {
        notification.error({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_DID_MODIFY_FAILED' }),
          top: 64,
          duration: 3
        });
        return false;
      }
    },

    *deleteDID({ payload }, { call, put }) {
      const res = yield call(API.deleteDID, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_DID_DELETE_SUCCESS' }),
          top: 64,
          duration: 3
        });
        return true;
      } else {
        notification.error({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_DID_DELETE_FAILED' }),
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

export default DIDModel;
