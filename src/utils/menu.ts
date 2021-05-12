import { tree2Arr } from './index';
import { Roles } from './roles';

/**
 * id: 菜单id
 * menuPid: 父菜单id
 * menuHref: 菜单路由
 * menuIcon: 菜单图标
 * menuName： 菜单名称
 * menuVos： 子菜单
 * accessRole: 可访问角色
 */
export type MenuProps = {
  id: number,
  menuPid: number,
  menuHref: string,
  menuIcon: string | null,
  menuName: string,
  menuVos: MenuProps[],
  accessRole: Roles,
}

const MenuList: MenuProps[] = [
  {
    id: 35,
    menuPid: 2,
    menuHref: '/about/league-dashboard',
    menuIcon: 'KBasslianmengguanli1',
    menuName: '联盟总览',
    accessRole: Roles.NetworkMember,
    menuVos: [],
  },
  {
    id: 36,
    menuPid: 2,
    menuHref: '/about/data-dashboard',
    menuIcon: 'KBassyibiaopan',
    menuName: '仪表盘',
    accessRole: Roles.NetworkAdmin,
    menuVos: [],
  },
  {
    id: 37,
    menuPid: 2,
    menuHref: '/about/block',
    menuIcon: 'KBassqukuailian',
    menuName: '区块链',
    accessRole: Roles.NetworkMember,
    menuVos: [],
  },
  {
    id: 38,
    menuPid: 2,
    menuHref: '/about/transactions',
    menuIcon: 'KBassjiaoyi',
    menuName: '交易',
    accessRole: Roles.NetworkMember,
    menuVos: [],
  },
  {
    id: 39,
    menuPid: 2,
    menuHref: '/about/channels',
    menuIcon: 'KBasstongdaoguanli',
    menuName: '通道管理',
    accessRole: Roles.NetworkMember,
    menuVos: [],
  },
  {
    id: 41,
    menuPid: 2,
    menuHref: '/about/organizations',
    menuIcon: 'KBasszuzhiguanli',
    menuName: '组织管理',
    accessRole: Roles.NetworkMember,
    menuVos: [],
  },
  {
    id: 42,
    menuPid: 2,
    menuHref: '/about/nodes',
    menuIcon: 'KBassjiedianguanli',
    menuName: '节点管理',
    accessRole: Roles.NetworkMember,
    menuVos: [],
  },
  {
    id: 44,
    menuPid: 2,
    menuHref: '/about/contract',
    menuIcon: 'KBassheyueguanli',
    menuName: '合约管理',
    accessRole: Roles.NetworkMember,
    menuVos: [
      {
        id: 430,
        menuPid: 43,
        menuHref: '/about/contract/myContract',
        menuIcon: null,
        menuName: '合约列表',
        accessRole: Roles.NetworkMember,
        menuVos: [],
      },
      // {
      //   id: 431,
      //   menuPid: 43,
      //   menuHref: '/about/contract/cTransfer',
      //   menuIcon: null,
      //   menuName: '合约调用',
      //   accessRole: Roles.NetworkMember,
      //   menuVos: [],
      // },
      // {
      //   id: 432,
      //   menuPid: 43,
      //   menuHref: '/about/contract/privacyStrategy',
      //   menuIcon: null,
      //   menuName: '隐私保护策略',
      //   accessRole: Roles.NetworkAdmin,
      //   menuVos: [],
      // },
      // {
      //   id: 448,
      //   menuPid: 43,
      //   menuHref: '/about/contract/contractStore',
      //   menuIcon: null,
      //   menuName: '合约仓库',
      //   accessRole: Roles.NetworkMember,
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
    accessRole: Roles.NetworkMember,
    menuVos: [],
  },
  // {
  //   id: 46,
  //   menuPid: 2,
  //   menuHref: "/about/certificate",
  //   menuIcon: "KBasszhengshuguanli",
  //   menuName: "证书管理",
  //   accessRole: Roles.NetworkMember,
  //   menuVos: []
  // },
  // {
  //   id: 47,
  //   menuPid: 2,
  //   menuHref: "/about/logsList",
  //   menuIcon: "KBassdakaixinfeng",
  //   menuName: "日志管理",
  //   accessRole: Roles.NetworkMember,
  //   menuVos: []
  // },
  {
    id: 48,
    menuPid: 2,
    menuHref: '/about/enterprise-member',
    menuIcon: 'KBasschengyuanguanli',
    menuName: '成员管理',
    accessRole: Roles.NetworkAdmin,
    menuVos: [],
  },
  // {
  //   id: 50,
  //   menuPid: 2,
  //   menuHref: "/about/message",
  //   menuIcon: "KBassxiaoxiguanli",
  //   menuName: "消息管理",
  //   accessRole: Roles.NetworkMember,
  //   menuVos: []
  // },
  {
    id: 52,
    menuPid: 2,
    menuHref: '/about/myinfo',
    menuIcon: 'KBasswodexinxi',
    menuName: '用户信息',
    accessRole: Roles.NetworkMember,
    menuVos: [
      {
        id: 520,
        menuPid: 52,
        menuHref: '/about/myinfo/MyLeague',
        menuIcon: null,
        menuName: '我的联盟',
        accessRole: Roles.NetworkMember,
        menuVos: [],
      },
      {
        id: 521,
        menuPid: 52,
        menuHref: '/about/myinfo/CompanyInfo',
        menuIcon: null,
        menuName: '我的信息',
        accessRole: Roles.NetworkMember,
        menuVos: [],
      },
      {
        id: 523,
        menuPid: 52,
        menuHref: '/about/myinfo/MyOrgList',
        menuIcon: null,
        menuName: '我的组织',
        accessRole: Roles.NetworkMember,
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
    accessRole: Roles.NetworkMember,
    menuVos: [
      {
        id: 55,
        menuPid: 54,
        menuHref: '/about/did/did-management',
        menuIcon: null,
        menuName: 'DID管理',
        accessRole: Roles.NetworkAdmin,
        menuVos: [],
      },
      {
        id: 56,
        menuPid: 54,
        menuHref: '/about/did/did-query',
        menuIcon: null,
        menuName: 'DID查询验证',
        accessRole: Roles.NetworkMember,
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
    accessRole: Roles.NetworkMember,
    menuVos: [
      {
        id: 75,
        menuPid: 74,
        menuHref: '/about/block-compile/package',
        menuIcon: null,
        menuName: '任务管理',
        accessRole: Roles.NetworkAdmin,
        menuVos: [],
      },
      {
        id: 76,
        menuPid: 74,
        menuHref: '/about/block-compile/storage',
        menuIcon: null,
        menuName: '镜像仓库',
        accessRole: Roles.NetworkMember,
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
    accessRole: Roles.NetworkMember,
    menuVos: [],
  },
  {
    id: 53,
    menuPid: 2,
    menuHref: '/about/elastic-cloud-server',
    menuIcon: 'KBasszhengshuguanli',
    menuName: '弹性云服务器管理',
    accessRole: Roles.NetworkAdmin,
    menuVos: [],
  },
  {
    id: 73,
    menuPid: 2,
    menuHref: '/about/rbac',
    menuIcon: 'KBasszhengshuguanli',
    menuName: '访问角色管理',
    accessRole: Roles.NetworkAdmin,
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
