import { getCookie } from './index';
import { getLocale, createIntl, createIntlCache } from 'umi';
import enUS from 'locales/en-US';
import zhCN from 'locales/zh-CN';
import { IntlShape } from 'react-intl';

/**
 * 根据cookie初始化语言类型
 * @constructor
 */
function InitLocales() {
  let cookie = getCookie();

  // 根据cookie设置localStorage
  if (cookie === 'en') {
    localStorage.setItem('umi_locale', 'en-US')
  } else if (cookie === 'zh') {
    localStorage.setItem('umi_locale', 'zh-CN')
  } else if (!cookie) {
    // 默认值语言中文
    var date = new Date();
    var expireDays = 10; //将date设置为10天以后的时间
    date.setTime(date.getTime() + expireDays * 24 * 3600 * 1000);
    document.cookie = `BAAS_LOCALE=${'en'};expire="+date.toGMTString()`;
    localStorage.setItem('umi_locale', 'en-US')
  }
}

class Locales {
  intl: IntlShape;

  messages = {
    'zh-CN': zhCN,
    'en-US': enUS
  }

  /**
   * [instance  当前实例]
   * @type {this}
   */
  static instance: this
  /**
   * [getInstance 获取单例]
   * @method getInstance
   * @return {[type]}    [description]
   */
  static getInstance() {
    if (false === this.instance instanceof this) {
      this.instance = new this();
    }
    return this.instance;
  }

  constructor() {
    const locales = getLocale() || 'zh-CN';
    const cache = createIntlCache();
    const intl = createIntl({
      locale: locales,
      messages: this.messages[locales]
    }, cache);
    this.intl = intl;
  }

  changeLocales() {
    const locales = getLocale() || 'zh-CN';
    const cache = createIntlCache();
    const intl = createIntl({
      locale: locales,
      messages: this.messages[locales]
    }, cache);
    this.intl = intl;
  }

  formatMessage = (id: string, values: object) => {
    if (values) {
      return this.intl.formatMessage(
        { id: id },
        { ...values }
      )
    }
    return this.intl.formatMessage({ id: id })
  }

}

const Intl = Locales.getInstance();

export {
  Intl,
  InitLocales,
}
