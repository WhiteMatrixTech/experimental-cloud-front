import { MenuList } from '../utils/menu.js';
import { tree2Arr } from '../utils';
const initBreadCrumb = MenuList.length > 0 ? MenuList[0] : {};
export default {
  namespace: 'Layout',

  state: {
    getUnreadMessage: 0, // 未读消息条数
    selectedMenu: '/about/leagueDashboard', // 当前选中菜单
    menuArr: tree2Arr(MenuList), // 菜单一维数组
    routerMeta: {}, // 路由缓存对象
    breadCrumbItem: [initBreadCrumb], // 匹配面包屑数组
    actionList: [], //所有功能按钮(后面版本会使用)
    ownerActionList: [], // 当前页面的功能按钮
    curDate: 0, //解决多次错误提示弹框
    menuList: [], // 菜单列表
    userType: localStorage.getItem('userType') || 2, // 用户类型
    isLoading: false, // loading
    companyId: localStorage.getItem('companyId'), // 企业id
    leagueId: localStorage.getItem('leagueId'), // 联盟id
    approvalStatus: localStorage.getItem('approvalStatus'), // 企业审批状态
    isLeague: localStorage.getItem('isLeague'), // 盟主身份判断
    orgInfo: localStorage.getItem('orgInfo'), // 我的组织对象
    companyIdOfadd: localStorage.getItem('companyIdOfadd'), // 游客临时企业id
    baseInfo: localStorage.getItem('baseInfo'), // 动态获取baseinfo
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
