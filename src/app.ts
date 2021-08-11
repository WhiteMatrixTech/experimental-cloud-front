import { history } from 'umi';
import { parse } from 'qs';
import { InitLocales } from './utils/locales';
import { pageAuthControl } from './utils/menu';
import { cancelCurrentRequest } from './utils/request';
// import { tree2Arr } from './utils';

//初始化国际化语言
InitLocales();

export const locale = {
  getLocale() {
    const locales = localStorage.getItem('umi_locale') || 'zh-CN';
    return locales;
  }
};

export const dva = {
  config: {
    onError(err: any) {
      err.preventDefault();
      console.error(err.message);
    }
  }
};


export function render(oldRender: () => void) {
  // const routes = getRoutes();
  const { pathname } = history.location;

  // 路由切换时，取消当前页面的请求
  cancelCurrentRequest();

  // 404路由控制
  // let isUnknownPage = false;
  // const allRoute = tree2Arr(routes, 'routes');
  // const matchRoute = allRoute.find((item: RouteProps) => item.path === pathname);
  // if (!matchRoute) {
  //   isUnknownPage = true;
  // } else if (matchRoute && matchRoute.exact && !state) {
  //   isUnknownPage = true;
  // }

  // 403路由控制
  const noAccessSituation = pageAuthControl(pathname);

  // 外部登录
  const search = window.location.search ? window.location.search.replace('?', '') : '';
  const { redirect } = parse(search);

  if (noAccessSituation) {
    history.push('/403');
    oldRender();
  } else if (redirect) {
    history.push(`/userForExternal/login?redirect=${redirect}`);
    oldRender();
  } else {
    oldRender();
  }
}
