/**
 * 外部登录 redirect 校验
 *
 * 登录成功后 access_token 会跟着 redirect 地址一起发出去，
 * 所以 redirect 只能指向受信任的站点，否则可以构造登录链接把 token 带到任意地址。
 */

/**
 * 受信任的站点：当前站点、ChainIDE（CHAIN_IDE_LINK），
 * 以及 EXTERNAL_LOGIN_REDIRECT_ORIGINS 中配置的站点（多个用逗号分隔）
 */
const getTrustedOrigins = (): string[] => {
  const links = [process.env.CHAIN_IDE_LINK, ...(process.env.EXTERNAL_LOGIN_REDIRECT_ORIGINS || '').split(',')];
  const origins = [window.location.origin];
  links.forEach((link) => {
    try {
      origins.push(new URL((link || '').trim()).origin);
    } catch (e) {
      // 未配置或配置的不是合法地址
    }
  });
  return origins;
};

/**
 * 返回可以安全跳转的地址，redirect 不合法或不受信任时返回 undefined
 */
export const getTrustedRedirect = (redirect: unknown): string | undefined => {
  if (typeof redirect !== 'string' || !redirect) {
    return undefined;
  }
  let url: URL;
  try {
    url = new URL(redirect, window.location.origin);
  } catch (e) {
    return undefined;
  }
  // 排除 javascript:、data: 等协议
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return undefined;
  }
  return getTrustedOrigins().includes(url.origin) ? url.href : undefined;
};
