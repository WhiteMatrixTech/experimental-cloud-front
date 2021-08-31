import type { Reducer, Effect } from 'umi';
import { LOCAL_STORAGE_ITEM_KEY } from '~/utils/const';

export type LayoutModelState = {
  getUnreadMessage: number;
  selectedMenu: string;
  commonPortalSelectedMenu: string;
  showDrawer: boolean;
  currentService: string;
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
    setCurrentService: Reducer<LayoutModelState>;
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
    currentService: localStorage.getItem(LOCAL_STORAGE_ITEM_KEY.DRAWER_CURRENT_SERVICE) || '',
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
    setCurrentService(state, action) {
      const { currentService } = action.payload;
      localStorage.setItem(LOCAL_STORAGE_ITEM_KEY.DRAWER_CURRENT_SERVICE, currentService);
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default LayoutModel;
