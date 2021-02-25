export function getRoutes() {
  const routes = [
    {
      path: '/404',
      exact: true,
    },
    {
      path: '/',
      exact: true,
    },
    {
      path: '/wrappers/auth',
      exact: true,
    },
    {
      path: '/about',
      routes: [
        {
          path: '/about/block',
          exact: true,
        },
        {
          path: '/about/block/:blockHash',
          exact: true,
        },
        {
          path: '/about/certificate',
          exact: true,
        },
        {
          path: '/about/evidence',
          exact: true,
        },
        {
          path: '/about/evidence/:evidenceHash',
          exact: true,
        },
        {
          path: '/about/contract/contractStore/contractStoreDetail',
          exact: true,
        },
        {
          path: '/about/contract/contractStore',
          exact: true,
        },
        {
          path: '/about/contract/cTransfer',
          exact: true,
        },
        {
          path: '/about/contract/myContract/contractDetail',
          exact: true,
        },
        {
          path: '/about/contract/myContract/contractHistoryDetail',
          exact: true,
        },
        {
          path: '/about/contract/myContract',
          exact: true,
        },
        {
          path: '/about/contract/privacyStrategy',
          exact: true,
        },
        {
          path: '/about/contract/privacyStrategy/protectRecord',
          exact: true,
        },
        {
          path: '/about/enterpriseMember',
          exact: true,
        },
        {
          path: '/about/enterpriseMember/:memberDetail',
          exact: true,
        },
        {
          path: '/about',
          exact: true,
        },
        {
          path: '/about/leagueDashboard',
          exact: true,
        },
        {
          path: '/about/dataDashboard',
          exact: true,
        },
        {
          path: '/about/logsList',
          exact: true,
        },
        {
          path: '/about/message',
          exact: true,
        },
        {
          path: '/about/message/:messageDetail',
          exact: true,
        },
        {
          path: '/about/myinfo/CompanyInfo',
          exact: true,
        },
        {
          path: '/about/myinfo/MyLeague',
          exact: true,
        },
        {
          path: '/about/myinfo/MyOrgList',
          exact: true,
        },
        {
          path: '/about/organizations',
          exact: true,
        },
        {
          path: '/about/nodes',
          exact: true,
        },
        {
          path: '/about/transactions',
          exact: true,
        },
        {
          path: '/about/transactions/:transactionHash',
          exact: true,
        },
        {
          path: '/about/channels',
          exact: true,
        },
        {
          path: '/about/channels/chaincodeList',
          exact: true,
        },
        {
          path: '/about/channels/channelDetail',
          exact: true,
        },
        {
          path: '/about/channels/organizationList',
          exact: true,
        },
        {
          path: '/about/channels/nodeList',
          exact: true,
        },
      ],
    },
    {
      path: '/selectLeague',
      routes: [
        {
          path: '/selectLeague',
          exact: true,
        },
      ],
    },
    {
      path: '/user',
      routes: [
        {
          path: '/user/login',
          exact: true,
        },
        {
          path: '/user/register',
          exact: true,
        },
        {
          path: '/user/register-result',
          exact: true,
        },
      ],
    },
    {
      path: '/userForExternal',
      routes: [
        {
          path: '/userForExternal/login',
          exact: true,
        },
      ],
    },
  ];

  return routes;
}
