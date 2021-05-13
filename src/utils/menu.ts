import { tree2Arr } from './index';
import { Roles } from './roles';

/**
 * id: 菜单id
 * menuPid: 父菜单id
 * menuHref: 菜单路由
 * menuIcon: 菜单图标
 * menuName： 菜单名称
 * subMenus： 子菜单
 * accessRole: 可访问角色
 */
export const RootMenuId = 'root';
export type MenuProps = {
  id: string,
  menuPid: string,
  menuHref: string,
  menuIcon: string | null,
  menuName: string,
  subMenus: MenuProps[],
  accessRole: Roles,
}

const MenuList: MenuProps[] = [
  {
    id: 'league-dashboard',
    menuPid: RootMenuId,
    menuHref: '/about/league-dashboard',
    menuIcon: 'KBasslianmengguanli1',
    menuName: '联盟总览',
    accessRole: Roles.NetworkMember,
    subMenus: [],
  },
  {
    id: 'data-dashboard',
    menuPid: RootMenuId,
    menuHref: '/about/data-dashboard',
    menuIcon: 'KBassyibiaopan',
    menuName: '仪表盘',
    accessRole: Roles.NetworkAdmin,
    subMenus: [],
  },
  {
    id: 'block',
    menuPid: RootMenuId,
    menuHref: '/about/block',
    menuIcon: 'KBassqukuailian',
    menuName: '区块链',
    accessRole: Roles.NetworkMember,
    subMenus: [],
  },
  {
    id: 'transactions',
    menuPid: RootMenuId,
    menuHref: '/about/transactions',
    menuIcon: 'KBassjiaoyi',
    menuName: '交易',
    accessRole: Roles.NetworkMember,
    subMenus: [],
  },
  {
    id: 'channels',
    menuPid: RootMenuId,
    menuHref: '/about/channels',
    menuIcon: 'KBasstongdaoguanli',
    menuName: '通道管理',
    accessRole: Roles.NetworkMember,
    subMenus: [],
  },
  {
    id: 'organizations',
    menuPid: RootMenuId,
    menuHref: '/about/organizations',
    menuIcon: 'KBasszuzhiguanli',
    menuName: '组织管理',
    accessRole: Roles.NetworkMember,
    subMenus: [],
  },
  {
    id: 'nodes',
    menuPid: RootMenuId,
    menuHref: '/about/nodes',
    menuIcon: 'KBassjiedianguanli',
    menuName: '节点管理',
    accessRole: Roles.NetworkMember,
    subMenus: [],
  },
  {
    id: 'contract',
    menuPid: RootMenuId,
    menuHref: '/about/contract',
    menuIcon: 'KBassheyueguanli',
    menuName: '合约管理',
    accessRole: Roles.NetworkMember,
    subMenus: [
      {
        id: 'myContract',
        menuPid: 'contract',
        menuHref: '/about/contract/myContract',
        menuIcon: null,
        menuName: '合约列表',
        accessRole: Roles.NetworkMember,
        subMenus: [],
      },
      // {
      //   id: 'cTransfer',
      //   menuPid: 'contract,
      //   menuHref: '/about/contract/cTransfer',
      //   menuIcon: null,
      //   menuName: '合约调用',
      //   accessRole: Roles.NetworkMember,
      //   subMenus: [],
      // },
      // {
      //   id: 'privacyStrategy',
      //   menuPid: 'contract,
      //   menuHref: '/about/contract/privacyStrategy',
      //   menuIcon: null,
      //   menuName: '隐私保护策略',
      //   accessRole: Roles.NetworkAdmin,
      //   subMenus: [],
      // },
      // {
      //   id: 'contractStore',
      //   menuPid: 'contract,
      //   menuHref: '/about/contract/contractStore',
      //   menuIcon: null,
      //   menuName: '合约仓库',
      //   accessRole: Roles.NetworkMember,
      //   subMenus: [],
      // },
    ],
  },
  {
    id: 'evidence',
    menuPid: RootMenuId,
    menuHref: '/about/evidence',
    menuIcon: 'KBasszhengshuguanli',
    menuName: '存证上链',
    accessRole: Roles.NetworkMember,
    subMenus: [],
  },
  // {
  //   id: 'certificate',
  //   menuPid: RootMenuId,
  //   menuHref: "/about/certificate",
  //   menuIcon: "KBasszhengshuguanli",
  //   menuName: "证书管理",
  //   accessRole: Roles.NetworkMember,
  //   subMenus: []
  // },
  // {
  //   id: 'logsList',
  //   menuPid: RootMenuId,
  //   menuHref: "/about/logsList",
  //   menuIcon: "KBassdakaixinfeng",
  //   menuName: "日志管理",
  //   accessRole: Roles.NetworkMember,
  //   subMenus: []
  // },
  {
    id: 'enterprise-member',
    menuPid: RootMenuId,
    menuHref: '/about/enterprise-member',
    menuIcon: 'KBasschengyuanguanli',
    menuName: '成员管理',
    accessRole: Roles.NetworkAdmin,
    subMenus: [],
  },
  // {
  //   id: 'message',
  //   menuPid: RootMenuId,
  //   menuHref: "/about/message",
  //   menuIcon: "KBassxiaoxiguanli",
  //   menuName: "消息管理",
  //   accessRole: Roles.NetworkMember,
  //   subMenus: []
  // },
  {
    id: 'myinfo',
    menuPid: RootMenuId,
    menuHref: '/about/myinfo',
    menuIcon: 'KBasswodexinxi',
    menuName: '用户信息',
    accessRole: Roles.NetworkMember,
    subMenus: [
      {
        id: 'MyLeague',
        menuPid: 'myinfo',
        menuHref: '/about/myinfo/MyLeague',
        menuIcon: null,
        menuName: '我的联盟',
        accessRole: Roles.NetworkMember,
        subMenus: [],
      },
      {
        id: 'CompanyInfo',
        menuPid: 'myinfo',
        menuHref: '/about/myinfo/CompanyInfo',
        menuIcon: null,
        menuName: '我的信息',
        accessRole: Roles.NetworkMember,
        subMenus: [],
      },
      {
        id: 'MyOrgList',
        menuPid: 'myinfo',
        menuHref: '/about/myinfo/MyOrgList',
        menuIcon: null,
        menuName: '我的组织',
        accessRole: Roles.NetworkMember,
        subMenus: [],
      },
    ],
  },
  // {
  //   id: 'did',
  //   menuPid: RootMenuId,
  //   menuHref: '/about/did',
  //   menuIcon: 'KBasslianmengguanli',
  //   menuName: 'DID身份链',
  //   accessRole: Roles.NetworkMember,
  //   subMenus: [
  //     {
  //       id: 'did-management',
  //       menuPid: 'did,
  //       menuHref: '/about/did/did-management',
  //       menuIcon: null,
  //       menuName: 'DID管理',
  //       accessRole: Roles.NetworkAdmin,
  //       subMenus: [],
  //     },
  //     {
  //       id: 'did-query',
  //       menuPid: 'did',
  //       menuHref: '/about/did/did-query',
  //       menuIcon: null,
  //       menuName: 'DID查询验证',
  //       accessRole: Roles.NetworkMember,
  //       subMenus: [],
  //     },
  //   ],
  // },
  {
    id: 'fabricUsers',
    menuPid: RootMenuId,
    menuHref: '/about/fabricUsers',
    menuIcon: 'KBasslianmengguanli',
    menuName: 'Fabric用户管理',
    accessRole: Roles.NetworkMember,
    subMenus: [],
  },
  {
    id: 'elastic-cloud-server',
    menuPid: RootMenuId,
    menuHref: '/about/elastic-cloud-server',
    menuIcon: 'KBasszhengshuguanli',
    menuName: '弹性云服务器管理',
    accessRole: Roles.NetworkAdmin,
    subMenus: [],
  },
  {
    id: 'rbac',
    menuPid: RootMenuId,
    menuHref: '/about/rbac',
    menuIcon: 'KBasszhengshuguanli',
    menuName: '访问角色管理',
    accessRole: Roles.NetworkAdmin,
    subMenus: [],
  },
  {
    id: 'block-compile',
    menuPid: RootMenuId,
    menuHref: '/about/block-compile',
    menuIcon: 'KBasslianmengguanli',
    menuName: '区块链编译',
    accessRole: Roles.NetworkMember,
    subMenus: [
      {
        id: 'package',
        menuPid: 'block-compile',
        menuHref: '/about/block-compile/package',
        menuIcon: null,
        menuName: '一键编译',
        accessRole: Roles.NetworkAdmin,
        subMenus: [],
      },
      {
        id: 'storage',
        menuPid: 'block-compile',
        menuHref: '/about/block-compile/storage',
        menuIcon: null,
        menuName: '镜像仓库',
        accessRole: Roles.NetworkMember,
        subMenus: [],
      },
    ],
  },
  {
    id: 'job-management',
    menuPid: RootMenuId,
    menuHref: '/about/job-management',
    menuIcon: 'KBasszhengshuguanli',
    menuName: '任务管理',
    accessRole: Roles.NetworkAdmin,
    subMenus: [],
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
