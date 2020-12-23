import * as API from 'services/block.js';
import { notification } from 'antd';

// import { MenuList, getCurBreadcrumb } from 'utils/menu.js';

export default {
  namespace: 'Block',

  state: {
    breadCrumbItem: null, // 匹配面包屑数组

    blockList: [], // 区块链列表
    blockTotal: 0,
    blockDetail: {}, // 当前区块详情

    transactionList: [], // 当前区块下的交易列表
    transactionTotal: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // return history.listen(({ pathname }) => {
      //   if (pathname.indexOf('/about/block') > -1) {
      //     const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/block')
      //     dispatch({
      //       type: 'common',
      //       payload: { breadCrumbItem }
      //     })
      //   }
      // });
    },
  },

  effects: {
    *getBlockTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getBlockTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockTotal: result,
          },
        });
      }
    },
    *getBlockList({ payload }, { call, put }) {
      const res = yield call(API.getBlockList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockList: result.items,
          },
        });
      }
    },
    *onSearch({ payload }, { call, put }) {
      const res = yield call(API.getBlockDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockTotal: 1,
            blockList: [result],
            blockDetail: result,
          },
        });
      } else if (statusCode === 404) {
        yield put({
          type: 'common',
          payload: {
            blockTotal: 0,
            blockList: [],
            blockDetail: '',
          },
        });
        notification.error({ message: res.message , top: 64, duration: 1 });
      }
    },
    *getBlockDetail({ payload }, { call, put }) {
      const res = yield call(API.getBlockDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockTotal: 1,
            blockList: [result],
            blockDetail: result,
          },
        });
      }
    },
    *getTxCountByBlockHash({ payload }, { call, put }) {
      const res = yield call(API.getTxCountByBlockHash, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionTotal: result,
          },
        });
      }
    },
    *getTransactionList({ payload }, { call, put }) {
      const res = yield call(API.getTransactionList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionList: result.items,
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
