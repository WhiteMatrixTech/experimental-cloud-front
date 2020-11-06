import { tree2Arr } from 'utils';

const MenuList = [
  {
    id: 36,
    menuPid: 2,
    menuHref: "/about/leagueDashboard",
    menuIcon: "KBassyibiaopan",
    menuName: "仪表盘",
    isFeature: 0,
    menuVos: []
  },
  {
    id: 37,
    menuPid: 2,
    menuHref: "/about/block",
    menuIcon: "KBassqukuailian",
    menuName: "区块链",
    isFeature: 0,
    menuVos: []
  },
  {
    id: 38,
    menuPid: 2,
    menuHref: "/about/channel",
    menuIcon: "KBassjiaoyi",
    menuName: "交易",
    isFeature: 0,
    menuVos: []
  },
  {
    id: 39,
    menuPid: 2,
    menuHref: "/about/unionList",
    menuIcon: "KBasstongdaoguanli",
    menuName: "通道管理",
    isFeature: 0,
    menuVos: []
  },
  {
    id: 41,
    menuPid: 2,
    menuHref: "/about/orgList",
    menuIcon: "KBasszuzhiguanli",
    menuName: "组织管理",
    isFeature: 0,
    menuVos: []
  },
  {
    id: 42,
    menuPid: 2,
    menuHref: "/about/peerList",
    menuIcon: "KBassjiedianguanli",
    menuName: "节点管理",
    isFeature: 0,
    menuVos: []
  },
  {
    id: 43,
    menuPid: 2,
    menuHref: "/about/contract",
    menuIcon: "KBassheyueguanli",
    menuName: "合约管理",
    isFeature: 0,
    menuVos: [
      {
        id: 430,
        menuPid: 43,
        menuHref: "/about/contract/myContract",
        menuIcon: null,
        menuName: "我的合约",
        isFeature: 0,
        menuVos: []
      },
      {
        id: 431,
        menuPid: 43,
        menuHref: "/about/contract/cTransfer",
        menuIcon: null,
        menuName: "合约调用",
        isFeature: 1,
        menuVos: []
      },
      {
        id: 432,
        menuPid: 43,
        menuHref: "/about/contract/roleData",
        menuIcon: null,
        menuName: "隐私保护策略",
        isFeature: 0,
        menuVos: []
      },
      {
        id: 448,
        menuPid: 43,
        menuHref: "/about/contract/ContractStore",
        menuIcon: null,
        menuName: "合约仓库",
        isFeature: 0,
        menuVos: []
      }
    ]
  },
  {
    id: 46,
    menuPid: 2,
    menuHref: "/about/certificate",
    menuIcon: "KBasszhengshuguanli",
    menuName: "证书管理",
    isFeature: 0,
    menuVos: []
  },
  {
    id: 47,
    menuPid: 2,
    menuHref: "/about/logsList",
    menuIcon: "KBassdakaixinfeng",
    menuName: "日志管理",
    isFeature: 0,
    menuVos: []
  },
  {
    id: 48,
    menuPid: 2,
    menuHref: "/about/enterpriseMember",
    menuIcon: "KBassqiyeguanli",
    menuName: "成员管理",
    isFeature: 0,
    menuVos: []
  },
  {
    id: 51,
    menuPid: 2,
    menuHref: "/about/message",
    menuIcon: "KBassxiaoxiguanli",
    menuName: "消息管理",
    isFeature: 0,
    menuVos: []
  },
  {
    id: 52,
    menuPid: 2,
    menuHref: "/about/myinfo",
    menuIcon: "KBasschengyuanguanli",
    menuName: "我的信息",
    isFeature: 0,
    menuVos: [
      {
        id: 520,
        menuPid: 52,
        menuHref: "/about/myinfo/MyLeague",
        menuIcon: null,
        menuName: "我的联盟",
        isFeature: 0,
        menuVos: []
      },
      {
        id: 521,
        menuPid: 52,
        menuHref: "/about/myinfo/CompanyInfo",
        menuIcon: null,
        menuName: "我的企业",
        isFeature: 0,
        menuVos: []
      },
      {
        id: 523,
        menuPid: 52,
        menuHref: "/about/myinfo/MyOrgList",
        menuIcon: null,
        menuName: "我的组织",
        isFeature: 1,
        menuVos: []
      }
    ]
  }
];

const getCurBreadcrumb = (menuList, keyword = '', isLeftMenu = true) => {
  const breadCrumb = [];
  const findMenu = tree2Arr(menuList).find(item => item.menuHref === keyword);
  if (findMenu) {
    findMenu.isLeftMenu = isLeftMenu;
    breadCrumb.push(findMenu);
  }
  return breadCrumb;
}

export {
  MenuList,
  getCurBreadcrumb
};