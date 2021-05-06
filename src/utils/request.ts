import { notification } from 'antd';
import { history } from 'umi';
import { extend } from 'umi-request';

let isSendNotification = false;

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

const authorization = (response: any) => {
  if (response.statusCode === 401 && response.message === 'Unauthorized') {
    if (!isSendNotification) {
      // 登录已过期
      notification.error({ message: '登录已过期', top: 64, duration: 3 });
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
  return response;
};

/** 异常处理程序 */
const errorHandler = (error: { response: Response }) => {
  const { response } = error;
  return response.json().then((formatResponseData) => {
    return authorization(formatResponseData);
  });
};

/**
 * Requests a URL, returning a promise.
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 */
export const request = (url: string, options?: { method: string, body: object }) => {
  let headers = {
    'Content-Type': 'application/json',
    Authorization: '',
    RoleAuth: ''
  };
  // token校验
  const accessToken = localStorage.getItem('accessToken');
  const roleToken = localStorage.getItem('roleToken');
  const needsToken = window.location.href.indexOf('/userForExternal/login') === -1;
  if (accessToken && needsToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  if (roleToken && needsToken) {
    headers.RoleAuth = roleToken;
  }
  // 配置umi request请求时的默认参数
  const _requestFunc = extend({
    errorHandler, // 默认错误处理
    mode: 'cors',
    timeout: 30000,
    headers: headers,
    // parseResponse: false,
    credentials: 'include', // 默认请求是否带上cookie,
    prefix: process.env.BAAS_BACKEND_LINK,
  });
  let newOptions = { method: options ? options.method : 'GET', data: {} };
  if (options && options.method) {
    newOptions.data = options.body;
  }
  return _requestFunc(url, newOptions).then((response) => {
    const data = {
      result: response,
      statusCode: response.statusCode || 'ok',
    };
    return data;
  });
};
