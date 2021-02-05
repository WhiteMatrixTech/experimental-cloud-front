import {getCookie} from './index';

/**
 * 根据cookie初始化语言类型
 * @constructor
 */
function InitLocales () {
  let cookie = getCookie('ZSMART_LOCALE');

  // 根据cookie设置localStorage
  if (cookie === 'en') {
    localStorage.setItem('umi_locale', 'en-US')
  } else if (cookie === 'zh') {
    localStorage.setItem('umi_locale', 'zh-CN')
  } else if (!cookie) {
    // 默认值语言中文
    var date = new Date();
    var expireDays = 10; //将date设置为10天以后的时间
    date.setTime(date.getTime() + expireDays*24*3600*1000);
    document.cookie = `ZSMART_LOCALE=${'en'};expire="+date.toGMTString()`;
    localStorage.setItem('umi_locale', 'en-US')
  }
}

export  {
  InitLocales,
}
