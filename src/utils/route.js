
export function getRoutes() {
  const routes = [
    {
      "path": "/404",
      "exact": true,
    },
    {
      "path": "/",
      "exact": true,
    },
    {
      "path": "/wrappers/auth",
      "exact": true,
    },
    {
      "path": "/about",
      "routes": [
        {
          "path": "/about/block",
          "exact": true,
        },
        {
          "path": "/about/block/:blockHash",
          "exact": true,
        },
        {
          "path": "/about/certificate",
          "exact": true,
        },
        {
          "path": "/about/certificateChain",
          "exact": true,
        },
        {
          "path": "/about/certificateChain/:evidenceHash",
          "exact": true,
        },
        {
          "path": "/about/contract/contractStore/contractStoreDetail",
          "exact": true,
        },
        {
          "path": "/about/contract/contractStore",
          "exact": true,
        },
        {
          "path": "/about/contract/cTransfer",
          "exact": true,
        },
        {
          "path": "/about/contract/myContract/contractDetail",
          "exact": true,
        },
        {
          "path": "/about/contract/myContract/contractHistoryDetail",
          "exact": true,
        },
        {
          "path": "/about/contract/myContract",
          "exact": true,
        },
        {
          "path": "/about/contract/roleData",
          "exact": true,
        },
        {
          "path": "/about/contract/roleData/roleDataList",
          "exact": true,
        },
        {
          "path": "/about/enterpriseMember",
          "exact": true,
        },
        {
          "path": "/about/enterpriseMember/:memberDetail",
          "exact": true,
        },
        {
          "path": "/about",
          "exact": true,
        },
        {
          "path": "/about/leagueDashboard",
          "exact": true,
        },
        {
          "path": "/about/logsList",
          "exact": true,
        },
        {
          "path": "/about/message",
          "exact": true,
        },
        {
          "path": "/about/message/:messageDetail",
          "exact": true,
        },
        {
          "path": "/about/myinfo/CompanyInfo",
          "exact": true,
        },
        {
          "path": "/about/myinfo/MyLeague",
          "exact": true,
        },
        {
          "path": "/about/myinfo/MyOrgList",
          "exact": true,
        },
        {
          "path": "/about/orgList",
          "exact": true,
        },
        {
          "path": "/about/peerList",
          "exact": true,
        },
        {
          "path": "/about/transactions",
          "exact": true,
        },
        {
          "path": "/about/transactions/:transactionHash",
          "exact": true,
        },
        {
          "path": "/about/unionList",
          "exact": true,
        },
        {
          "path": "/about/unionList/UnionChain",
          "exact": true,
        },
        {
          "path": "/about/unionList/UnionDetail",
          "exact": true,
        },
        {
          "path": "/about/unionList/UnionMember",
          "exact": true,
        },
        {
          "path": "/about/unionList/UnionPeer",
          "exact": true,
        }
      ],
    },
    {
      "path": "/selectLeague",
      "routes": [
        {
          "path": "/selectLeague",
          "exact": true,
        }
      ],
    },
    {
      "path": "/user",
      "routes": [
        {
          "path": "/user/login",
          "exact": true,
        },
        {
          "path": "/user/register",
          "exact": true,
        },
        {
          "path": "/user/register-result",
          "exact": true,
        }
      ],
    },
    {
      "path": "/userForExternal",
      "routes": [
        {
          "path": "/userForExternal/login",
          "exact": true,
        }
      ],
    }
  ];

  return routes;
}
