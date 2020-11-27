import * as API from 'services/block.js';
// import { MenuList, getCurBreadcrumb } from 'utils/menu.js';

export default {
  namespace: 'Block',

  state: {
    breadCrumbItem: null, // 匹配面包屑数组

    blockList: [], // 区块链列表
    blockTotal: 0,

    blockDetail: {}, // 当前区块详情

    transactionList: [], // 当前区块下的交易列表
    transactionTotal: 0
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
    *getBlockList({ payload }, { call, put }) {
      const res = yield call(API.getBlockList, payload)
      const { status, result } = res;
      if (status === 'ok') {

        yield put({
          type: 'common',
          payload: {
            blockList: result.list,
            blockTotal: result.totalDocs
          }
        });
      }
    },
    *getBlockDetail({ payload }, { call, put }) {
      const res = yield call(API.getBlockDetail, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockDetail: result
          }
        });
      }
    },
    *getTransactionList({ payload }, { call, put }) {
      const res = yield call(API.getTransactionList, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionList: result.list,
            transactionTotal: result.totalDocs
          }
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
