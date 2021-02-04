import { notification } from 'antd';
import { fetch } from 'dva';
import config from './config';
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = (response, check_500) => {
  if ((response.status >= 200 && response.status < 300) || (response.status === 500 && check_500)) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.message;
  const error = new Error(errortext);
  error.response = response;
  throw error;
};

const authorization = response => {
  if (response.statusCode === 401 && response.message === 'Unauthorized') {
    // 登录已过期
    notification.error({ message: '登录已过期', top: 64, duration: 1 });
    // 清空缓存
    window.localStorage.clear();
    // 强制刷新页面
    window.location.reload();
    // 抛出错误信息
    const error = new Error(response.message);
    error.response = response;
    throw error;
  }
  const data = {
    result: response,
    statusCode: response.statusCode || 'ok',
  };
  return data
}

const getResponseData = response => {
  // 登出时会重定向
  if (response.redirected) {
    return response.text();
  }
  return response.json();
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export const request = (url, options) => {
  const defaultOptions = {
    headers: {

    },
    mode: 'cors'
  };
  // token校验
  const accessToken = localStorage.getItem('accessToken');
  const roleToken = localStorage.getItem('roleToken');
  const needsToken = window.location.href.indexOf('/userForexternal/login') === -1;
  if (accessToken && needsToken) {
    defaultOptions.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (roleToken && needsToken) {
    defaultOptions.headers.RoleAuth = roleToken;
  }
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }
  const requestUrl = process.env.BAAS_BACKEND_LINK + url;
  return fetch(requestUrl, newOptions)
    // .then((res) => checkStatus(res, true))
    .then(getResponseData)
    .then((data) => authorization(data))
    .catch((e) => {
      const response = e.response;
      if (response) {
        return response.json();
      } else {
        const error = new Error(response.message);
        error.response = response;
        return error;
      }
    });
};
