import {
  CodeSandboxOutlined,
  FileTextOutlined,
  DeploymentUnitOutlined,
  DashboardOutlined,
  BlockOutlined,
  TransactionOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  SolutionOutlined,
  IdcardOutlined,
  FileProtectOutlined,
  PartitionOutlined,
  ApartmentOutlined,
  FileSearchOutlined,
  ClusterOutlined,
  AuditOutlined
} from '@ant-design/icons';
import { LOCAL_STORAGE_ITEM_KEY } from './const';
import { decryptData, deviceId } from './encryptAndDecrypt';
import { getAllPath, tree2Arr } from './index';
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
interface BasicMenuProps {
  id: string;
  menuPid: string;
  menuHref: string;
  menuIcon: JSX.Element | string | null;
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
    menuIcon: <CodeSandboxOutlined />,
    menuName: '联盟总览',
    accessRole: [Roles.MEMBER, Roles.ADMIN],
    subMenus: []
  },
  {
    id: 'data-dashboard',
    menuPid: RootMenuId,
    menuHref: '/about/data-dashboard',
    menuIcon: <DashboardOutlined />,
    menuName: '仪表盘',
    accessRole: [Roles.ADMIN],
    subMenus: []
  },
  {
    id: 'block',
    menuPid: RootMenuId,
    menuHref: '/about/block',
    menuIcon: <BlockOutlined />,
    menuName: '区块数据',
    accessRole: [Roles.MEMBER, Roles.ADMIN],
    subMenus: []
  },
  {
    id: 'transactions',
    menuPid: RootMenuId,
    menuHref: '/about/transactions',
    menuIcon: <TransactionOutlined />,
    menuName: '交易信息',
    accessRole: [Roles.MEMBER, Roles.ADMIN],
    subMenus: []
  },
  {
    id: 'channels',
    menuPid: RootMenuId,
    menuHref: '/about/channels',
    menuIcon: <PartitionOutlined />,
    menuName: '通道管理',
    accessRole: [Roles.MEMBER, Roles.ADMIN],
    subMenus: []
  },
  {
    id: 'organizations',
    menuPid: RootMenuId,
    menuHref: '/about/organizations',
    menuIcon: <ApartmentOutlined />,
    menuName: '组织管理',
    accessRole: [Roles.MEMBER, Roles.ADMIN],
    subMenus: []
  },
  {
    id: 'nodes',
    menuPid: RootMenuId,
    menuHref: '/about/nodes',
    menuIcon: <DeploymentUnitOutlined />,
    menuName: '节点管理',
    accessRole: [Roles.MEMBER, Roles.ADMIN],
    subMenus: []
  },
  {
    id: 'contract',
    menuPid: RootMenuId,
    menuHref: '/about/contract',
    menuIcon: <FileTextOutlined />,
    menuName: '合约管理',
    accessRole: [Roles.MEMBER, Roles.ADMIN],
    subMenus: []
  },
  {
    id: 'evidence',
    menuPid: RootMenuId,
    menuHref: '/about/evidence',
    menuIcon: <FileProtectOutlined />,
    menuName: '存证上链',
    accessRole: [Roles.MEMBER, Roles.ADMIN],
    subMenus: []
  },
  {
    id: 'enterprise-member',
    menuPid: RootMenuId,
    menuHref: '/about/enterprise-member',
    menuIcon: <TeamOutlined />,
    menuName: '成员管理',
    accessRole: [Roles.ADMIN],
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
    menuIcon: <IdcardOutlined />,
    menuName: '用户信息',
    accessRole: [Roles.MEMBER, Roles.ADMIN],
    subMenus: [
      {
        id: 'MyLeague',
        menuPid: 'myinfo',
        menuHref: '/about/myinfo/MyLeague',
        menuIcon: null,
        menuName: '我的联盟',
        accessRole: [Roles.MEMBER, Roles.ADMIN],
        subMenus: []
      },
      {
        id: 'CompanyInfo',
        menuPid: 'myinfo',
        menuHref: '/about/myinfo/CompanyInfo',
        menuIcon: null,
        menuName: '我的信息',
        accessRole: [Roles.MEMBER, Roles.ADMIN],
        subMenus: []
      },
      {
        id: 'MyOrgList',
        menuPid: 'myinfo',
        menuHref: '/about/myinfo/MyOrgList',
        menuIcon: null,
        menuName: '我的组织',
        accessRole: [Roles.MEMBER, Roles.ADMIN],
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
    menuIcon: <SolutionOutlined />,
    menuName: 'Fabric用户管理',
    accessRole: [Roles.MEMBER, Roles.ADMIN],
    subMenus: []
  },
  {
    id: 'rbac',
    menuPid: RootMenuId,
    menuHref: '/about/rbac',
    menuIcon: <SafetyCertificateOutlined />,
    menuName: '访问角色管理',
    accessRole: [Roles.ADMIN],
    subMenus: []
  }
];

const CommonMenuList: CommonMenuProps[] = [
  {
    id: 'user-management',
    menuPid: RootMenuId,
    menuHref: '/common/user-management',
    menuIcon: <AuditOutlined />,
    menuName: '用户管理',
    accessRole: [Roles.SUPER],
    subMenus: []
  },
  {
    id: 'cluster-management',
    menuPid: RootMenuId,
    menuHref: '/common/cluster-management',
    menuIcon: <ClusterOutlined />,
    menuName: '集群管理',
    accessRole: [Roles.ADMIN, Roles.SUPER],
    subMenus: []
  },
  {
    id: 'job-management',
    menuPid: RootMenuId,
    menuHref: '/common/job-management',
    menuIcon: <FileSearchOutlined />,
    menuName: '任务管理',
    accessRole: [Roles.ADMIN, Roles.SUPER],
    subMenus: []
  },
  {
    id: 'block-compile',
    menuPid: RootMenuId,
    menuHref: '/common/block-compile',
    menuIcon: <DeploymentUnitOutlined />,
    menuName: '区块链编译',
    accessRole: [Roles.ADMIN, Roles.SUPER],
    subMenus: [
      {
        id: 'package',
        menuPid: 'block-compile',
        menuHref: '/common/block-compile/package',
        menuIcon: null,
        menuName: '一键编译',
        accessRole: [Roles.ADMIN, Roles.SUPER],
        subMenus: []
      },
      {
        id: 'storage',
        menuPid: 'block-compile',
        menuHref: '/common/block-compile/storage',
        menuIcon: null,
        menuName: '自定义镜像管理',
        accessRole: [Roles.ADMIN, Roles.SUPER],
        subMenus: []
      }
    ]
  }
  // {
  //   id: 'elastic-cloud-server',
  //   menuPid: RootMenuId,
  //   menuHref: '/common/elastic-cloud-server',
  //   menuIcon: <CloudServerOutlined />,
  //   menuName: '弹性云服务器管理',
  //   accessRole: [Roles.NetworkAdmin, Roles.SuperUser],
  //   subMenus: []
  // },
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
  let role = localStorage.getItem(LOCAL_STORAGE_ITEM_KEY.USER_ROLE);
  role = role && decryptData(role, deviceId);

  let userRole = localStorage.getItem(LOCAL_STORAGE_ITEM_KEY.USER_ROLE_IN_NETWORK);
  userRole = userRole && decryptData(userRole, deviceId);

  const isNetworkMenu = allNetworkMenu.find((menu) => menu.menuHref === pathname);
  if (isNetworkMenu) {
    return !isNetworkMenu.accessRole.includes(userRole as Roles);
  }
  const isCommonMenu = allCommonMenu.find((menu) => menu.menuHref === pathname);
  if (isCommonMenu) {
    return !isCommonMenu.accessRole.includes(role as Roles);
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
