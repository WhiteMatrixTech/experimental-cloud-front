export default {
  namespace: 'Layout',

  state: {
    getUnreadMessage: 0, // 未读消息条数
    selectedMenu: localStorage.getItem('selectedMenu') || '/about/league-dashboard', // 当前选中菜单
  },

  subscriptions: {
    setup({ dispatch, history }) {},
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
