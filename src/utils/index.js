/**
 * 工具集
 **
 */

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';

/**
 * 删除左右两端的空格
 * @param {*} str 
 */
export const trim = (str) => {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

export const getCookie = () => {
  let cookieStr = document.cookie;
  console.log('cookieStr', cookieStr);
  if (cookieStr) {
    let cookieArr = cookieStr.replace(/\s/g, '').split(";");
    if (cookieArr && cookieArr.length > 0) {
      for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].split("=");
        if (cookie[0]) {
          if ("ZSMART_LOCALE" == trim(cookie[0])) {
            return cookie[1] || ""
          }
        }
      }
    }
  }
  return "en";
}

// tree数据压平为数组
export const tree2Arr = (data, childrenName = 'children') => {
  let arr = [];
  let tempData = cloneDeep(data);
  const spread = (tempData = []) => {
    tempData.forEach(el => {
      if (get(el, childrenName) && get(el, childrenName).length > 0) {
        spread(get(el, childrenName));
      };
      // el[childrenName] = [];
      arr.push(el);
    })
  }
  spread(tempData);
  return arr;
}
