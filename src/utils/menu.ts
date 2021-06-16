import { getAllPath, tree2Arr } from './index';
import { Roles } from './roles';
import { Intl } from '~/utils/locales';

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
interface BasicMenuProps {
  id: string;
  menuPid: string;
  menuHref: string;
  menuIcon: string | null;
  menuName: string;
  accessRole: Roles[];
}
export interface NetworkMenuProps extends BasicMenuProps {
  subMenus: NetworkMenuProps[];
}

export interface CommonMenuProps extends BasicMenuProps {
  subMenus: CommonMenuProps[];
}

export interface IMenuPathProps {
  allPath: string[];
  finalPath: string;
  finalPathName: string;
  pathAccess: Roles[];
}

const NetworkMenuList: NetworkMenuProps[] = [
  {
    id: 'league-dashboard',
    menuPid: RootMenuId,
    menuHref: '/about/league-dashboard',
    menuIcon: 'KBasslianmengguanli1',
    menuName: Intl.formatMessage('BASS_CONSORTIUM_INFORMATION_DISPLAY'),
    accessRole: [Roles.NetworkMember, Roles.NetworkAdmin],
    subMenus: []
  },
  {
    id: 'data-dashboard',
    menuPid: RootMenuId,
    menuHref: '/about/data-dashboard',
    menuIcon: 'KBassyibiaopan',
    menuName: Intl.formatMessage('BASS_DASHBOARD'),
    accessRole: [Roles.NetworkAdmin],
    subMenus: []
  },
  {
    id: 'block',
    menuPid: RootMenuId,
    menuHref: '/about/block',
    menuIcon: 'KBassqukuailian',
    menuName: Intl.formatMessage('BASS_BLOCK_BLOCKCHAIN'),
    accessRole: [Roles.NetworkMember, Roles.NetworkAdmin],
    subMenus: []
  },
  {
    id: 'transactions',
    menuPid: RootMenuId,
    menuHref: '/about/transactions',
    menuIcon: 'KBassjiaoyi',
    menuName: Intl.formatMessage('BASS_TRANSACTION'),
    accessRole: [Roles.NetworkMember, Roles.NetworkAdmin],
    subMenus: []
  },
  {
    id: 'channels',
    menuPid: RootMenuId,
    menuHref: '/about/channels',
    menuIcon: 'KBasstongdaoguanli',
    menuName: Intl.formatMessage('BASS_CHANNEL_MANAGEMENT'),
    accessRole: [Roles.NetworkMember, Roles.NetworkAdmin],
    subMenus: []
  },
  {
    id: 'organizations',
    menuPid: RootMenuId,
    menuHref: '/about/organizations',
    menuIcon: 'KBasszuzhiguanli',
    menuName: Intl.formatMessage('BASS_ORGANSIZATION_MANAGEMENT'),
    accessRole: [Roles.NetworkMember, Roles.NetworkAdmin],
    subMenus: []
  },
  {
    id: 'nodes',
    menuPid: RootMenuId,
    menuHref: '/about/nodes',
    menuIcon: 'KBassjiedianguanli',
    menuName: Intl.formatMessage('BASS_NODE_MANAGEMENT'),
    accessRole: [Roles.NetworkMember, Roles.NetworkAdmin],
    subMenus: []
  },
  {
    id: 'contract',
    menuPid: RootMenuId,
    menuHref: '/about/contract',
    menuIcon: 'KBassheyueguanli',
    menuName: Intl.formatMessage('BASS_CONTRACT_MANAGEMENT'),
    accessRole: [Roles.NetworkMember, Roles.NetworkAdmin],
    subMenus: []
  },
  {
    id: 'evidence',
    menuPid: RootMenuId,
    menuHref: '/about/evidence',
    menuIcon: 'KBasszhengshuguanli',
    menuName: Intl.formatMessage('BASS_EVIDENCE_ON_CHAIN'),
    accessRole: [Roles.NetworkMember, Roles.NetworkAdmin],
    subMenus: []
  },
  {
    id: 'enterprise-member',
    menuPid: RootMenuId,
    menuHref: '/about/enterprise-member',
    menuIcon: 'KBasschengyuanguanli',
    menuName: Intl.formatMessage('BASS_MEMBER_MANAGEMENT'),
    accessRole: [Roles.NetworkAdmin],
    subMenus: []
  },
  // {
  //   id: 'message',
  //   menuPid: RootMenuId,
  //   menuHref: "/about/message",
  //   menuIcon: "KBassxiaoxiguanli",
  //   menuName: "消息管理",
  //   accessRole: [Roles.NetworkMember, Roles.NetworkAdmin],
  //   subMenus: []
  // },
  {
    id: 'myinfo',
    menuPid: RootMenuId,
    menuHref: '/about/myinfo',
    menuIcon: 'KBasswodexinxi',
    menuName: Intl.formatMessage('BASS_USER_INFO_USER_INFORMATION'),
    accessRole: [Roles.NetworkMember, Roles.NetworkAdmin],
    subMenus: [
      {
        id: 'MyLeague',
        menuPid: 'myinfo',
        menuHref: '/about/myinfo/MyLeague',
        menuIcon: null,
        menuName: Intl.formatMessage('BASS_USER_INFO_MY_CONSORTIUM'),
        accessRole: [Roles.NetworkMember, Roles.NetworkAdmin],
        subMenus: []
      },
      {
        id: 'CompanyInfo',
        menuPid: 'myinfo',
        menuHref: '/about/myinfo/CompanyInfo',
        menuIcon: null,
        menuName: Intl.formatMessage('BASS_USER_INFO_MY_INFORMATION'),
        accessRole: [Roles.NetworkMember, Roles.NetworkAdmin],
        subMenus: []
      },
      {
        id: 'MyOrgList',
        menuPid: 'myinfo',
        menuHref: '/about/myinfo/MyOrgList',
        menuIcon: null,
        menuName: Intl.formatMessage('BASS_USER_INFO_MY_ORGANIZATION'),
        accessRole: [Roles.NetworkMember, Roles.NetworkAdmin],
        subMenus: []
      }
    ]
  },
  // {
  //   id: 'did',
  //   menuPid: RootMenuId,
  //   menuHref: '/about/did',
  //   menuIcon: 'KBasslianmengguanli',
  //   menuName: 'DID身份链',
  //   accessRole: [Roles.NetworkMember, Roles.NetworkAdmin],
  //   subMenus: [
  //     {
  //       id: 'did-management',
  //       menuPid: 'did',
  //       menuHref: '/about/did/did-management',
  //       menuIcon: null,
  //       menuName: 'DID管理',
  //       accessRole: [Roles.NetworkAdmin],
  //       subMenus: [],
  //     },
  //     {
  //       id: 'did-query',
  //       menuPid: 'did',
  //       menuHref: '/about/did/did-query',
  //       menuIcon: null,
  //       menuName: 'DID查询验证',
  //       accessRole: [Roles.NetworkMember, Roles.NetworkAdmin],
  //       subMenus: [],
  //     },
  //   ],
  // },
  {
    id: 'fabricUsers',
    menuPid: RootMenuId,
    menuHref: '/about/fabricUsers',
    menuIcon: 'KBasslianmengguanli',
    menuName: Intl.formatMessage('BASS_FABRIC_USER_MANAGEMENTS'),
    accessRole: [Roles.NetworkMember, Roles.NetworkAdmin],
    subMenus: []
  },
  {
    id: 'rbac',
    menuPid: RootMenuId,
    menuHref: '/about/rbac',
    menuIcon: 'KBasszhengshuguanli',
    menuName: Intl.formatMessage('BASS_RBAC_ACCESS_ROLE_MANAGEMENT'),
    accessRole: [Roles.NetworkAdmin],
    subMenus: []
  }
];

const CommonMenuList: CommonMenuProps[] = [
  {
    id: 'job-management',
    menuPid: RootMenuId,
    menuHref: '/common/job-management',
    menuIcon: 'KBasszhengshuguanli',
    menuName: Intl.formatMessage('BASS_TASK_MANAGEMENT'),
    accessRole: [Roles.Member, Roles.Admin, Roles.SuperUser],
    subMenus: []
  },
  {
    id: 'block-compile',
    menuPid: RootMenuId,
    menuHref: '/common/block-compile',
    menuIcon: 'KBasslianmengguanli',
    menuName: Intl.formatMessage('BASS_ONE_KEY_COMPILE_BLOCK'),
    accessRole: [Roles.Member, Roles.Admin, Roles.SuperUser],
    subMenus: [
      {
        id: 'package',
        menuPid: 'block-compile',
        menuHref: '/common/block-compile/package',
        menuIcon: null,
        menuName: Intl.formatMessage('BASS_ONE_KEY_COMPILE'),
        accessRole: [Roles.Member, Roles.Admin, Roles.SuperUser],
        subMenus: []
      },
      {
        id: 'storage',
        menuPid: 'block-compile',
        menuHref: '/common/block-compile/storage',
        menuIcon: null,
        menuName: Intl.formatMessage('BASS_CUSTOM_IMAGE_MANAGEMENT'),
        accessRole: [Roles.Member, Roles.Admin, Roles.SuperUser],
        subMenus: []
      }
    ]
  },
  {
    id: 'elastic-cloud-server',
    menuPid: RootMenuId,
    menuHref: '/common/elastic-cloud-server',
    menuIcon: 'KBasszhengshuguanli',
    menuName: Intl.formatMessage('BASS_ELASTIC_CLOUD_SERVER'),
    accessRole: [Roles.Admin, Roles.SuperUser],
    subMenus: []
  },
  {
    id: 'user-role-management',
    menuPid: RootMenuId,
    menuHref: '/common/user-role-management',
    menuIcon: 'KBasslianmengguanli',
    menuName: Intl.formatMessage('BASS_USER_INFO_ROLE_MANAGEMENT'),
    accessRole: [Roles.SuperUser],
    subMenus: []
  }
];

const getCurBreadcrumb = (menuList: NetworkMenuProps[] | CommonMenuProps[], keyword = '', isLeftMenu = true) => {
  const breadCrumb = [];
  const findMenu = tree2Arr(menuList).find((item) => item.menuHref === keyword);
  if (findMenu) {
    findMenu.isLeftMenu = isLeftMenu;
    breadCrumb.push(findMenu);
  }
  return breadCrumb;
};

const getAllMenuPath = (pathList: CommonMenuProps[][]): IMenuPathProps[] => {
  let menuPath: IMenuPathProps[] = [];
  pathList.forEach((path) => {
    let onePath: IMenuPathProps = {
      allPath: [],
      finalPath: '',
      finalPathName: '',
      pathAccess: []
    };
    const endIndex = path.length - 1;
    path.forEach((menu, index) => {
      onePath.allPath.push(menu.menuName);
      if (endIndex === index) {
        onePath.finalPath = menu.menuHref;
        onePath.finalPathName = menu.menuName;
        onePath.pathAccess = menu.accessRole;
        menuPath.push(onePath);
      }
    });
  });
  return menuPath;
};
const NetworkMenuPath: IMenuPathProps[] = getAllMenuPath(getAllPath(NetworkMenuList, 'subMenus'));
const CommonMenuPath: IMenuPathProps[] = getAllMenuPath(getAllPath(CommonMenuList, 'subMenus'));

const allNetworkMenu: NetworkMenuProps[] = tree2Arr(NetworkMenuList, 'subMenus');
const allCommonMenu: CommonMenuProps[] = tree2Arr(CommonMenuList, 'subMenus');
const pageAuthControl = (pathname: string): boolean => {
  const userRole = localStorage.getItem('userRole') as Roles;
  const role = localStorage.getItem('role') as Roles;
  const isNetworkMenu = allNetworkMenu.find((menu) => menu.menuHref === pathname);
  if (isNetworkMenu) {
    return !isNetworkMenu.accessRole.includes(userRole);
  }
  const isCommonMenu = allCommonMenu.find((menu) => menu.menuHref === pathname);
  if (isCommonMenu) {
    return !isCommonMenu.accessRole.includes(role);
  }
  return false;
};

export {
  NetworkMenuList as MenuList,
  CommonMenuList,
  NetworkMenuPath,
  CommonMenuPath,
  getCurBreadcrumb,
  pageAuthControl
};
