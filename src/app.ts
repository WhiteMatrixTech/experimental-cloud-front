import { history } from 'umi';
import { parse } from 'qs';
import { InitLocales } from './utils/locales';
import { pageAuthControl } from './utils/menu';
import { cancelCurrentRequest } from './utils/request';
import { LOCAL_STORAGE_ITEM_KEY } from './utils/const';
import { deviceId, encryptData } from './utils/encryptAndDecrypt';

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
  const { pathname } = history.location;

  // 路由切换时，取消当前页面的请求
  cancelCurrentRequest();

  // 403路由控制
  const noAccessSituation = pageAuthControl(pathname);

  // 外部登录
  const search = window.location.search ? window.location.search.replace('?', '') : '';
  const { redirect, token } = parse(search);

  if (noAccessSituation) {
    history.push('/403');
    oldRender();
  } else if (redirect) {
    history.push(`/userForExternal/login?redirect=${redirect}`);
    oldRender();
  } else if (token) {
    localStorage.setItem(LOCAL_STORAGE_ITEM_KEY.ACCESS_TOKEN, encryptData(token as string, deviceId));
    history.push('/selectLeague');
    oldRender();
  } else {
    oldRender();
  }
}
