import type { Reducer, Effect } from 'umi';

export type LayoutModelState = {
  getUnreadMessage: number;
  selectedMenu: string;
}

export type LayoutModelType = {
  namespace: 'Layout';
  state: LayoutModelState;
  effects: {
    getNewMenuList: Effect;
  };
  reducers: {
    common: Reducer<LayoutModelState>;
  };
};

const LayoutModel: LayoutModelType = {
  namespace: 'Layout',

  state: {
    getUnreadMessage: 0, // 未读消息条数
    selectedMenu: localStorage.getItem('selectedMenu') || '/about/league-dashboard', // 当前选中菜单
  },

  effects: {
    *getNewMenuList({ payload }, { call, put }) {
      let { userType } = payload;
      yield put({
        type: 'common',
        payload: {
          userType,
        },
      });
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};

export default LayoutModel;
