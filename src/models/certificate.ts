import * as API from '../services/certificate';
import type { Reducer, Effect } from 'umi';

export type CertificateModelState = {
  certificateList: Array<object>,
  certificateTotal: number,
}

export type CertificateModelType = {
  namespace: 'Certificate';
  state: CertificateModelState;
  effects: {
    getCertificateList: Effect;
  };
  reducers: {
    common: Reducer<CertificateModelState>;
  };
};

const CertificateModel: CertificateModelType = {
  namespace: 'Certificate',

  state: {
    certificateList: [],
    certificateTotal: 0,
  },

  effects: {
    *getCertificateList({ payload }, { call, put }) {
      const res = yield call(API.getCertificateList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            certificateList: result.list,
            certificateTotal: result.totalDocs,
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

export default CertificateModel;
