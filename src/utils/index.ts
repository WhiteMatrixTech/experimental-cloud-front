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
export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '');
};

export const getCookie = () => {
  let cookieStr = document.cookie;
  if (cookieStr) {
    let cookieArr = cookieStr.replace(/\s/g, '').split(';');
    if (cookieArr && cookieArr.length > 0) {
      for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].split('=');
        if (cookie[0]) {
          if ('BAAS_LOCALE' === trim(cookie[0])) {
            return cookie[1] || '';
          }
        }
      }
    }
  }
  return 'en';
};

// tree数据压平为数组
export const tree2Arr = (data: Array<any>, childrenName = 'children') => {
  let arr: any[] = [];
  let tempData = cloneDeep(data);
  const spread = (tempData = []) => {
    tempData.forEach((el) => {
      if (get(el, childrenName) && get(el, childrenName).length > 0) {
        spread(get(el, childrenName));
      }
      // el[childrenName] = [];
      arr.push(el);
    });
  };
  spread(tempData);
  return arr;
};

// tree数据遍历得到所有路径
export const getAllPath = (data: any[], childrenName: string) => {
  let path: any[] = [];
  let allPath: any[][] = [];
  let finalPath: any[][] = [];
  const findAllPath = (tree: any) => {
    if (tree == null) {
      return;
    }
    path.push(tree);
    let newPath = [...path];
    if (tree[childrenName] && tree[childrenName].length === 0) {
      allPath.push(newPath);
    }
    if (tree[childrenName] && tree[childrenName].length > 0) {
      tree[childrenName].forEach((item: any) => findAllPath(item));
    }
    path.pop();
  };
  data.forEach((item) => {
    findAllPath(item);
    allPath.forEach((onePath) => finalPath.push(onePath));
    allPath = [];
    path = [];
  });
  return finalPath;
};

// 求取A-B
export const getDifferenceSet = (arrA: Array<any>, arrB: Array<any>, key: string) => {
  let result = arrA.reduce(function (pre, cur) {
    if (arrB.every((item) => item[key] !== cur[key])) {
      pre.push(cur);
    }
    return pre;
  }, []);
  return result;
};
