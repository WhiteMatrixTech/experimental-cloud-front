import type { Reducer, Effect } from 'umi';

export enum Portal {
  NetworkPortal = 'NetworkPortal',
  CommonPortal = 'CommonPortal',
}

export const PortalNames = {
  [Portal.NetworkPortal]: {
    portalName: 'Network Portal',
    path: '/about',
  },
  [Portal.CommonPortal]: {
    portalName: 'Common Portal',
    path: '/common',
  },
};

export type LayoutModelState = {
  getUnreadMessage: number;
  selectedMenu: string;
  commonPortalSelectedMenu: string;
  currentPortal: Portal;
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
    currentPortal: Portal.NetworkPortal,
    getUnreadMessage: 0, // 未读消息条数
    commonPortalSelectedMenu: localStorage.getItem('commonPortalSelectedMenu') || '/common/job-management',
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
