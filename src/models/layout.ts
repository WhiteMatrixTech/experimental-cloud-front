import type { Reducer, Effect } from 'umi';
import { LOCAL_STORAGE_ITEM_KEY } from '~/utils/const';

export type LayoutModelState = {
  getUnreadMessage: number;
  selectedMenu: string;
  commonPortalSelectedMenu: string;
  showDrawer: boolean;
  globalLoading: boolean;
  loadingDescription: string;
};

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
    commonPortalSelectedMenu:
      localStorage.getItem(LOCAL_STORAGE_ITEM_KEY.COMMON_PORTAL_SELECTED_MENU) || '/common/job-management',
    selectedMenu:
      localStorage.getItem(LOCAL_STORAGE_ITEM_KEY.NETWORK_PORTAL_SELECTED_MENU) || '/about/league-dashboard', // 当前选中菜单
    showDrawer: false,
    globalLoading: false,
    loadingDescription: ''
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
