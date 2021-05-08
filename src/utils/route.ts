export type RouteProps = {
  path: string,
  exact?: boolean,
  routes?: RouteProps[],
}

export function getRoutes(): RouteProps[] {
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
          routes: [
            {
              path: '/about/block/:blockHash',
              exact: true,
            },
          ],
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
          path: '/about/enterprise-member',
          routes: [
            {
              path: '/about/enterprise-member/:memberDetail',
              exact: true,
            },
          ],
        },
        {
          path: '/about/contract',
          exact: true,
          routes: [
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
          ],
        },
        {
          path: '/about',
          exact: true,
        },
        {
          path: '/about/league-dashboard',
          exact: true,
        },
        {
          path: '/about/data-dashboard',
          exact: true,
        },
        {
          path: '/about/elastic-cloud-server',
          exact: true,
          routes: [
            {
              path: '/about/elastic-cloud-server/server-performance',
              exact: true,
            },
            {
              path: '/about/elastic-cloud-server/resource-usage',
              exact: true,
            },
          ],
        },
        {
          path: '/about/block-compile',
          exact: true,
          routes: [
            {
              path: '/about/block-compile/package',
              exact: true,
            },
            {
              path: '/about/block-compile/storage',
              exact: true,
            },
          ],
        },
        {
          path: '/about/rbac',
          exact: true,
          routes: [
            {
              path: '/about/rbac/config',
              exact: true,
            },
            {
              path: '/about/rbac/new',
              exact: true,
            },
            {
              path: '/about/rbac/detail',
              exact: true,
            },
          ],
        },
        {
          path: '/about/logsList',
          exact: true,
        },
        {
          path: '/about/message',
          exact: true,
          routes: [
            {
              path: '/about/message/:messageDetail',
              exact: true,
            },
          ],
        },
        {
          path: '/about/myinfo',
          routes: [
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
          ],
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
          path: '/about/fabricUsers',
          exact: true,
        },
        {
          path: '/about/ipfs',
          exact: true,
        },
        {
          path: '/about/did',
          exact: true,
          routes: [
            {
              path: '/about/did/did-management',
              exact: true,
              routes: [
                {
                  path: '/about/did/did-management/did-detail',
                  exact: true,
                },
              ],
            },
            {
              path: '/about/did/did-query',
              exact: true,
            },
          ],
        },
        {
          path: '/about/transactions',
          exact: true,
          routes: [
            {
              path: '/about/transactions/:transactionHash',
              exact: true,
            },
          ],
        },
        {
          path: '/about/channels',
          exact: true,
          routes: [
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
      path: '/userManagement',
      routes: [
        {
          path: '/userManagement',
          exact: true,
          routes: [
            {
              path: '/userManagement/user-roles',
              exact: true,
            },
          ],
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
