import { tree2Arr } from './index';

/**
 * id: 菜单id
 * menuPid: 父菜单id
 * menuHref: 菜单路由
 * menuIcon: 菜单图标
 * menuName： 菜单名称
 * isFeature： 是否只有盟主才显示  0--成员；1--盟主；2--Admin
 * menuVos： 子菜单
 */
export type MenuProps = {
  id: number,
  menuPid: number,
  menuHref: string,
  menuIcon: string | null,
  menuName: string,
  isFeature: number,
  menuVos: MenuProps[],
}

const MenuList: MenuProps[] = [
  {
    id: 35,
    menuPid: 2,
    menuHref: '/about/league-dashboard',
    menuIcon: 'KBasslianmengguanli1',
    menuName: '联盟总览',
    isFeature: 0,
    menuVos: [],
  },
  {
    id: 36,
    menuPid: 2,
    menuHref: '/about/data-dashboard',
    menuIcon: 'KBassyibiaopan',
    menuName: '仪表盘',
    isFeature: 1,
    menuVos: [],
  },
  {
    id: 37,
    menuPid: 2,
    menuHref: '/about/block',
    menuIcon: 'KBassqukuailian',
    menuName: '区块链',
    isFeature: 0,
    menuVos: [],
  },
  {
    id: 38,
    menuPid: 2,
    menuHref: '/about/transactions',
    menuIcon: 'KBassjiaoyi',
    menuName: '交易',
    isFeature: 0,
    menuVos: [],
  },
  {
    id: 39,
    menuPid: 2,
    menuHref: '/about/channels',
    menuIcon: 'KBasstongdaoguanli',
    menuName: '通道管理',
    isFeature: 0,
    menuVos: [],
  },
  {
    id: 41,
    menuPid: 2,
    menuHref: '/about/organizations',
    menuIcon: 'KBasszuzhiguanli',
    menuName: '组织管理',
    isFeature: 0, // 是否只有盟主才显示
    menuVos: [],
  },
  {
    id: 42,
    menuPid: 2,
    menuHref: '/about/nodes',
    menuIcon: 'KBassjiedianguanli',
    menuName: '节点管理',
    isFeature: 0,
    menuVos: [],
  },
  {
    id: 44,
    menuPid: 2,
    menuHref: '/about/contract',
    menuIcon: 'KBassheyueguanli',
    menuName: '合约管理',
    isFeature: 0,
    menuVos: [
      {
        id: 430,
        menuPid: 43,
        menuHref: '/about/contract/myContract',
        menuIcon: null,
        menuName: '合约列表',
        isFeature: 0,
        menuVos: [],
      },
      // {
      //   id: 431,
      //   menuPid: 43,
      //   menuHref: '/about/contract/cTransfer',
      //   menuIcon: null,
      //   menuName: '合约调用',
      //   isFeature: 0,
      //   menuVos: [],
      // },
      // {
      //   id: 432,
      //   menuPid: 43,
      //   menuHref: '/about/contract/privacyStrategy',
      //   menuIcon: null,
      //   menuName: '隐私保护策略',
      //   isFeature: 1, // 是否只有盟主才显示
      //   menuVos: [],
      // },
      // {
      //   id: 448,
      //   menuPid: 43,
      //   menuHref: '/about/contract/contractStore',
      //   menuIcon: null,
      //   menuName: '合约仓库',
      //   isFeature: 0,
      //   menuVos: [],
      // },
    ],
  },
  {
    id: 45,
    menuPid: 2,
    menuHref: '/about/evidence',
    menuIcon: 'KBasszhengshuguanli',
    menuName: '存证上链',
    isFeature: 0,
    menuVos: [],
  },
  // {
  //   id: 46,
  //   menuPid: 2,
  //   menuHref: "/about/certificate",
  //   menuIcon: "KBasszhengshuguanli",
  //   menuName: "证书管理",
  //   isFeature: 0,
  //   menuVos: []
  // },
  // {
  //   id: 47,
  //   menuPid: 2,
  //   menuHref: "/about/logsList",
  //   menuIcon: "KBassdakaixinfeng",
  //   menuName: "日志管理",
  //   isFeature: 0,
  //   menuVos: []
  // },
  {
    id: 48,
    menuPid: 2,
    menuHref: '/about/enterprise-member',
    menuIcon: 'KBasschengyuanguanli',
    menuName: '成员管理',
    isFeature: 1, // 是否只有盟主才显示
    menuVos: [],
  },
  // {
  //   id: 50,
  //   menuPid: 2,
  //   menuHref: "/about/message",
  //   menuIcon: "KBassxiaoxiguanli",
  //   menuName: "消息管理",
  //   isFeature: 0,
  //   menuVos: []
  // },
  {
    id: 52,
    menuPid: 2,
    menuHref: '/about/myinfo',
    menuIcon: 'KBasswodexinxi',
    menuName: '用户信息',
    isFeature: 0,
    menuVos: [
      {
        id: 520,
        menuPid: 52,
        menuHref: '/about/myinfo/MyLeague',
        menuIcon: null,
        menuName: '我的联盟',
        isFeature: 0,
        menuVos: [],
      },
      {
        id: 521,
        menuPid: 52,
        menuHref: '/about/myinfo/CompanyInfo',
        menuIcon: null,
        menuName: '我的信息',
        isFeature: 0,
        menuVos: [],
      },
      {
        id: 523,
        menuPid: 52,
        menuHref: '/about/myinfo/MyOrgList',
        menuIcon: null,
        menuName: '我的组织',
        isFeature: 0,
        menuVos: [],
      },
    ],
  },
  {
    id: 54,
    menuPid: 2,
    menuHref: '/about/did',
    menuIcon: 'KBasslianmengguanli',
    menuName: 'DID身份链',
    isFeature: 0,
    menuVos: [
      {
        id: 55,
        menuPid: 54,
        menuHref: '/about/did/did-management',
        menuIcon: null,
        menuName: 'DID管理',
        isFeature: 1,
        menuVos: [],
      },
      {
        id: 56,
        menuPid: 54,
        menuHref: '/about/did/did-query',
        menuIcon: null,
        menuName: 'DID查询验证',
        isFeature: 0,
        menuVos: [],
      },
    ],
  },
  {
    id: 74,
    menuPid: 2,
    menuHref: '/about/block-compile',
    menuIcon: 'KBasslianmengguanli',
    menuName: '区块链编译',
    isFeature: 0,
    menuVos: [
      {
        id: 75,
        menuPid: 74,
        menuHref: '/about/block-compile/package',
        menuIcon: null,
        menuName: '源码打包',
        isFeature: 1,
        menuVos: [],
      },
      {
        id: 76,
        menuPid: 74,
        menuHref: '/about/block-compile/storage',
        menuIcon: null,
        menuName: '镜像仓库',
        isFeature: 0,
        menuVos: [],
      },
    ],
  },
  {
    id: 43,
    menuPid: 2,
    menuHref: '/about/fabricUsers',
    menuIcon: 'KBasslianmengguanli',
    menuName: 'Fabric用户管理',
    isFeature: 0,
    menuVos: [],
  },
  {
    id: 53,
    menuPid: 2,
    menuHref: '/about/elastic-cloud-server',
    menuIcon: 'KBasszhengshuguanli',
    menuName: '弹性云服务器管理',
    isFeature: 1, // 是否只有盟主才显示
    menuVos: [],
  },
  {
    id: 73,
    menuPid: 2,
    menuHref: '/about/rbac',
    menuIcon: 'KBasszhengshuguanli',
    menuName: '访问角色管理',
    isFeature: 1, // 是否只有盟主才显示
    menuVos: [],
  },
];

const getCurBreadcrumb = (menuList: MenuProps[], keyword = '', isLeftMenu = true) => {
  const breadCrumb = [];
  const findMenu = tree2Arr(menuList).find((item) => item.menuHref === keyword);
  if (findMenu) {
    findMenu.isLeftMenu = isLeftMenu;
    breadCrumb.push(findMenu);
  }
  return breadCrumb;
};

export { MenuList, getCurBreadcrumb };
