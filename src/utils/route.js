
export function getRoutes() {
  const routes = [
    {
      "path": "/404",
      "exact": true,
      "component": require('@/pages/404.jsx').default
    },
    {
      "path": "/",
      "exact": true,
      "component": require('@/pages/index.js').default,
      "wrappers": [require('D:/WorkSpace/DFI-front-react/src/pages/wrappers/auth').default]
    },
    {
      "path": "/wrappers/auth",
      "exact": true,
      "component": require('@/pages/wrappers/auth.js').default
    },
    {
      "path": "/about",
      "routes": [
        {
          "path": "/about/block",
          "exact": true,
          "component": require('@/pages/about/block/index.js').default
        },
        {
          "path": "/about/block/:blockHash",
          "exact": true,
          "component": require('@/pages/about/block/[blockHash]/index.js').default
        },
        {
          "path": "/about/certificate",
          "exact": true,
          "component": require('@/pages/about/certificate/index.js').default
        },
        {
          "path": "/about/certificateChain",
          "exact": true,
          "component": require('@/pages/about/certificateChain/index.js').default
        },
        {
          "path": "/about/certificateChain/:evidenceHash",
          "exact": true,
          "component": require('@/pages/about/certificateChain/[evidenceHash]/index.js').default
        },
        {
          "path": "/about/contract/contractStore/contractStoreDetail",
          "exact": true,
          "component": require('@/pages/about/contract/contractStore/contractStoreDetail/index.js').default
        },
        {
          "path": "/about/contract/contractStore",
          "exact": true,
          "component": require('@/pages/about/contract/contractStore/index.js').default
        },
        {
          "path": "/about/contract/cTransfer",
          "exact": true,
          "component": require('@/pages/about/contract/cTransfer/index.js').default
        },
        {
          "path": "/about/contract/myContract/contractDetail",
          "exact": true,
          "component": require('@/pages/about/contract/myContract/contractDetail/index.js').default
        },
        {
          "path": "/about/contract/myContract/contractHistoryDetail",
          "exact": true,
          "component": require('@/pages/about/contract/myContract/contractHistoryDetail/index.js').default
        },
        {
          "path": "/about/contract/myContract",
          "exact": true,
          "component": require('@/pages/about/contract/myContract/index.js').default
        },
        {
          "path": "/about/contract/roleData",
          "exact": true,
          "component": require('@/pages/about/contract/roleData/index.js').default
        },
        {
          "path": "/about/contract/roleData/roleDataList",
          "exact": true,
          "component": require('@/pages/about/contract/roleData/roleDataList/index.js').default
        },
        {
          "path": "/about/enterpriseMember",
          "exact": true,
          "component": require('@/pages/about/enterpriseMember/index.js').default
        },
        {
          "path": "/about/enterpriseMember/:memberDetail",
          "exact": true,
          "component": require('@/pages/about/enterpriseMember/[memberDetail]/index.js').default
        },
        {
          "path": "/about",
          "exact": true,
          "component": require('@/pages/about/index.js').default
        },
        {
          "path": "/about/leagueDashboard",
          "exact": true,
          "component": require('@/pages/about/leagueDashboard/index.js').default
        },
        {
          "path": "/about/logsList",
          "exact": true,
          "component": require('@/pages/about/logsList/index.js').default
        },
        {
          "path": "/about/message",
          "exact": true,
          "component": require('@/pages/about/message/index.js').default
        },
        {
          "path": "/about/message/:messageDetail",
          "exact": true,
          "component": require('@/pages/about/message/[messageDetail]/index.js').default
        },
        {
          "path": "/about/myinfo/CompanyInfo",
          "exact": true,
          "component": require('@/pages/about/myinfo/CompanyInfo/index.js').default
        },
        {
          "path": "/about/myinfo/MyLeague",
          "exact": true,
          "component": require('@/pages/about/myinfo/MyLeague/index.js').default
        },
        {
          "path": "/about/myinfo/MyOrgList",
          "exact": true,
          "component": require('@/pages/about/myinfo/MyOrgList/index.js').default
        },
        {
          "path": "/about/orgList",
          "exact": true,
          "component": require('@/pages/about/orgList/index.js').default
        },
        {
          "path": "/about/peerList",
          "exact": true,
          "component": require('@/pages/about/peerList/index.js').default
        },
        {
          "path": "/about/transactions",
          "exact": true,
          "component": require('@/pages/about/transactions/index.js').default
        },
        {
          "path": "/about/transactions/:transactionHash",
          "exact": true,
          "component": require('@/pages/about/transactions/[transactionHash]/index.js').default
        },
        {
          "path": "/about/unionList",
          "exact": true,
          "component": require('@/pages/about/unionList/index.js').default
        },
        {
          "path": "/about/unionList/UnionChain",
          "exact": true,
          "component": require('@/pages/about/unionList/UnionChain/index.js').default
        },
        {
          "path": "/about/unionList/UnionDetail",
          "exact": true,
          "component": require('@/pages/about/unionList/UnionDetail/index.js').default
        },
        {
          "path": "/about/unionList/UnionMember",
          "exact": true,
          "component": require('@/pages/about/unionList/UnionMember/index.js').default
        },
        {
          "path": "/about/unionList/UnionPeer",
          "exact": true,
          "component": require('@/pages/about/unionList/UnionPeer/index.js').default
        }
      ],
      "component": require('@/pages/about/_layout.js').default,
      "wrappers": [require('D:/WorkSpace/DFI-front-react/src/pages/wrappers/auth').default]
    },
    {
      "path": "/selectLeague",
      "routes": [
        {
          "path": "/selectLeague",
          "exact": true,
          "component": require('@/pages/selectLeague/index.js').default
        }
      ],
      "component": require('@/pages/selectLeague/_layout.js').default,
      "wrappers": [require('D:/WorkSpace/DFI-front-react/src/pages/wrappers/auth').default]
    },
    {
      "path": "/user",
      "routes": [
        {
          "path": "/user/login",
          "exact": true,
          "component": require('@/pages/user/login/index.js').default
        },
        {
          "path": "/user/register",
          "exact": true,
          "component": require('@/pages/user/register/index.js').default
        },
        {
          "path": "/user/register-result",
          "exact": true,
          "component": require('@/pages/user/register-result/index.jsx').default
        }
      ],
      "component": require('@/pages/user/_layout.js').default
    },
    {
      "path": "/userForExternal",
      "routes": [
        {
          "path": "/userForExternal/login",
          "exact": true,
          "component": require('@/pages/userForExternal/login/index.js').default
        }
      ],
      "component": require('@/pages/userForExternal/_layout.js').default
    }
  ];

  return routes;
}
