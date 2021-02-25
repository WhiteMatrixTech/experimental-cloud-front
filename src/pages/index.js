import React from 'react';
import { Redirect, history } from 'umi';
import { getRoutes } from 'utils/route';
import { tree2Arr } from 'utils';

const routes = getRoutes();
const pathname = history.location.pathname;

const allRoute = tree2Arr(routes, 'routes');
const matchRoute = allRoute.find((item) => item.path.indexOf(pathname) > -1);

// 当前路由找不到，则返回404页面
if (!matchRoute) {
  history.push('/404');
}

const index = () => {
  const accessToken = localStorage.getItem('accessToken');
  const roleToken = localStorage.getItem('roleToken');
  if (accessToken && roleToken) {
    return <Redirect to="/about/leagueDashboard" />;
  } else if (accessToken && !roleToken) {
    return <Redirect to="/selectLeague" />;
  }
};

index.wrappers = ['wrappers/auth'];

export default index;
