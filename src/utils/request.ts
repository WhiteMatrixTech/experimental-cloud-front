import { notification } from 'antd';
import { history } from 'umi';
import { stringify } from 'qs';
import { extend, ResponseError } from 'umi-request';
import { getTokenData } from './encryptAndDecrypt';

let isSendNotification = false;

const authorization = (response: Response) => {
  if (response.status === 401 && !response.url.includes('/login')) {
    if (!isSendNotification) {
      // 登录已过期
      notification.error({ message: '登录已过期', top: 64, duration: 1 });
      isSendNotification = true;
    }
    // 清空缓存
    window.localStorage.clear();
    // 强制刷新页面
    // window.location.reload();
    setTimeout(() => {
      history.push('/user/login');
    }, 1000);
    return;
  }

  isSendNotification = false;

  return response.json().then((formatResponseData) => {
    return {
      ...formatResponseData,
      statusCode: response.status
    };
  });
};

/** 异常处理程序 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  return authorization(response);
};

let cancelRequestArray: Array<{
  controller: AbortController;
  url: string;
}> = [];

const bassBackendLink = process.env.BAAS_BACKEND_LINK;
// 配置umi request请求时的默认参数
const _requestFunc = extend({
  errorHandler, // 默认错误处理
  mode: 'cors',
  timeout: 30000,
  // parseResponse: false,
  credentials: 'include', // 默认请求是否带上cookie,
  prefix: bassBackendLink === '/api' ? `${window.location.origin}/api` : bassBackendLink
});

_requestFunc.interceptors.request.use((url, options) => {
  let headers = {
    'Content-Type': 'application/json',
    Authorization: '',
    RoleAuth: ''
  };
  // token校验
  const { accessToken, roleToken } = getTokenData();

  const { pathname } = new URL(url);
  const needsToken = window.location.href.indexOf('/userForExternal/login') === -1;
  if (accessToken && needsToken && pathname !== '/login') {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  if (roleToken && needsToken) {
    headers.RoleAuth = roleToken;
  }
  options.headers = {
    ...options.headers,
    ...headers
  };
  // add abort signal
  const abortController = new AbortController();
  options.signal = abortController.signal;
  cancelRequestArray.push({ controller: abortController, url });

  return { url, options };
});

/**
 * cancel the current network request in progress
 */
export function cancelCurrentRequest() {
  cancelRequestArray.forEach((item) => {
    const { controller } = item;
    if (!controller.signal.aborted) {
      controller.abort();
    }
  });
  // init
  cancelRequestArray = [];
}

/**
 * Requests a URL, returning a promise.
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 */
export const request = <R>(url: string, options?: { method: string; body?: object }) => {
  let newOptions = { method: options ? options.method : 'GET', data: options?.body };
  let newUrl = url;
  if (options?.method === 'GET') {
    newUrl = `${url}?${stringify(options.body)}`;
  }
  return _requestFunc(newUrl, newOptions).then((response) => {
    const data = {
      result: response as R,
      statusCode: response.statusCode || 'ok'
    };
    return data;
  });
};

export const FILE_UPLOAD_BASE_URL = process.env.PROXY_ENDPOINT;
export const fileRequest = extend({
  errorHandler, // 默认错误处理
  mode: 'cors',
  timeout: 30000,
  credentials: 'include', // 默认请求是否带上cookie,
  prefix: FILE_UPLOAD_BASE_URL
});
