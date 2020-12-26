export default {
  namespace: 'Layout',

  state: {
    getUnreadMessage: 0, // 未读消息条数
    selectedMenu: '/about/leagueDashboard', // 当前选中菜单

    userType: localStorage.getItem('userType') || 2, // 用户类型
  },

  subscriptions: {
    setup({ dispatch, history }) { },
  },

  effects: {
    *getNewMenuList({ payload }, { call, put }) {
      let { userType } = payload;
      localStorage.setItem('userType', userType) // 动态改变用户类型
      yield put({
        type: 'common',
        payload: {
          userType
        }
      });
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
