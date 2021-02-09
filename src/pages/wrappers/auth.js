import { Redirect } from 'umi';
import { parse } from 'qs';
import { tree2Arr } from 'utils';

const search = window.location.search ? window.location.search.replace('?', '') : '';
const { redirect } = parse(search);

export default (props) => {
  const { route, routes, location } = props;
  const accessToken = localStorage.getItem('accessToken');
  const roleToken = localStorage.getItem('roleToken');
  const pathname = location.pathname;
  const allRoute = tree2Arr(routes, 'routes');

  const macthRoute = allRoute.find((item) => item.path.indexOf(route.path) > -1);
  if (redirect) {
    return <Redirect to={`/userForexternal/login?redirect=${redirect}`} />;
  }
  // 当前路由找不到，则返回404页面
  if (!macthRoute) {
    return <Redirect to="/404" />;
  }

  if (accessToken && roleToken) {
    return <>{props.children}</>;
  } else if (accessToken && !roleToken && pathname.indexOf('/selectLeague') > -1) {
    return <>{props.children}</>;
  } else {
    return <Redirect to="/user/login" />;
  }
};
