import { history } from 'umi';
import { parse } from 'qs';
import { InitLocales } from './utils/locales';
import { getRoutes, RouteProps } from './utils/route';
import { MenuList, MenuProps } from './utils/menu';
import { Roles } from './utils/roles';
import { tree2Arr } from './utils';

//初始化国际化语言
InitLocales();

export const locale = {
  getLocale() {
    const locales = localStorage.getItem('umi_locale') || 'zh-CN';
    return locales;
  },
};

export const dva = {
  config: {
    onError(err: any) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};

export function render(oldRender: () => void) {
  const routes = getRoutes();
  const pathname = history.location.pathname;

  // 404路由控制
  const allRoute = tree2Arr(routes, 'routes');
  const matchRoute = allRoute.find((item: RouteProps) => item.path.indexOf(pathname) > -1);

  // 403路由控制
  const userRole = localStorage.getItem('userRole');
  const role = localStorage.getItem('role');
  const allMenu = tree2Arr(MenuList, 'subMenus');
  let isAdminPage = false;
  let isSuperUserPage = false;
  allMenu
    .filter((menu: MenuProps) => menu.accessRole !== Roles.NetworkMember)
    .forEach((menu: MenuProps) => {
      if (pathname.indexOf(menu.menuHref) > -1) {
        isAdminPage = true;
      }
    });
  if (pathname.indexOf('userManagement') > -1) {
    isSuperUserPage = true;
  }

  // 外部登录
  const search = window.location.search ? window.location.search.replace('?', '') : '';
  const { redirect } = parse(search);
  const noAccessSituation = (userRole === Roles.NetworkMember && isAdminPage) || (role !== Roles.SuperUser && isSuperUserPage);


  if (noAccessSituation) {
    history.push('/403');
    oldRender();
  } else if (redirect) {
    history.push(`/userForExternal/login?redirect=${redirect}`);
    oldRender();
  } else if (matchRoute) {
    oldRender();
  } else {
    history.push('/404');
    oldRender();
  }
}
