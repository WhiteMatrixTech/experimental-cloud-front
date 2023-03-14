export type RouteProps = {
  path: string;
  exact?: boolean;
  routes?: RouteProps[];
};

export function getRoutes(): RouteProps[] {
  const routes = [
    {
      path: '/403'
    },
    {
      path: '/404'
    },
    {
      path: '/'
    },
    {
      path: '/wrappers/auth'
    },
    {
      path: '/about',
      routes: [
        {
          path: '/about/block'
        },
        {
          path: '/about/block/:blockHash'
        },
        {
          path: '/about/channels/:channelId/chaincodeList',
          exact: true
        },
        {
          path: '/about/channels/:channelId/channelDetail',
          exact: true
        },
        {
          path: '/about/channels'
        },
        {
          path: '/about/channels/:channelId/nodeList',
          exact: true
        },
        {
          path: '/about/channels/:channelId/organizationList',
          exact: true
        },
        {
          path: '/about/contract/:chainCodeName/contractDetail',
          exact: true
        },
        {
          path: '/about/contract'
        },
        {
          path: '/about/data-dashboard'
        },
        // {
        //   path: "/about/did/did-management/did-detail/:did",
        //   exact: true
        // },
        // {
        //   path: "/about/did/did-management",
        // },
        // {
        //   path: "/about/did/did-query",
        // },
        {
          path: '/about/enterprise-member'
        },
        {
          path: '/about/enterprise-member/:memberDetail'
        },
        {
          path: '/about/evidence'
        },
        {
          path: '/about/evidence/:evidenceHash'
        },
        {
          path: '/about/fabricUsers'
        },
        {
          path: '/about'
        },
        {
          path: '/about/ipfs'
        },
        {
          path: '/about/league-dashboard'
        },
        // {
        //   path: "/about/logsList",
        // },
        // {
        //   path: "/about/message",
        // },
        // {
        //   path: "/about/message/:messageDetail",
        // },
        {
          path: '/about/myinfo/CompanyInfo'
        },
        {
          path: '/about/myinfo/MyLeague'
        },
        {
          path: '/about/myinfo/MyOrgList'
        },
        {
          path: '/about/nodes'
        },
        {
          path: '/about/organizations'
        },
        {
          path: '/about/rbac/:roleName/config',
          exact: true
        },
        {
          path: '/about/rbac/:roleName/detail',
          exact: true
        },
        {
          path: '/about/rbac'
        },
        {
          path: '/about/rbac/new',
          exact: true
        },
        {
          path: '/about/transactions'
        },
        {
          path: '/about/transactions/:transactionHash'
        }
      ]
    },
    {
      path: '/common',
      routes: [
        {
          path: '/common/block-compile/package'
        },
        {
          path: '/common/block-compile/package/job-logs/:buildJobId',
          exact: true
        },
        {
          path: '/common/block-compile/storage'
        },
        {
          path: '/common/cluster-management'
        },
        // {
        //   path: '/common/elastic-cloud-server'
        // },
        // {
        //   path: '/common/elastic-cloud-server/:serverName/resource-usage',
        //   exact: true
        // },
        // {
        //   path: '/common/elastic-cloud-server/:serverName/server-performance',
        //   exact: true
        // },
        {
          path: '/common'
        },
        {
          path: '/common/job-management'
        },
        {
          path: '/common/job-management/job-logs/:jobId',
          exact: true
        },
        {
          path: '/common/user-management'
        }
      ]
    },
    {
      path: '/selectLeague',
      routes: [
        {
          path: '/selectLeague'
        }
      ]
    },
    {
      path: '/user',
      routes: [
        {
          path: '/user/login'
        },
        {
          path: '/user/register'
        },
        {
          path: '/user/register-result',
          exact: true
        }
      ]
    },
    {
      path: '/userForExternal',
      routes: [
        {
          path: '/userForExternal/login'
        }
      ]
    }
  ];

  return routes;
}
