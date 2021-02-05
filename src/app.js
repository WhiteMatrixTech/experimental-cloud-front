import { InitLocales } from 'utils/locales'
//初始化国际化语言
InitLocales()

export const locale = {
  getLocale() {
    const locales = localStorage.getItem('umi_locale') || 'zh-CN';
    return locales
  },
};

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
}
