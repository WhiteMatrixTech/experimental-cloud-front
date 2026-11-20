import { getTrustedRedirect } from './redirect';

describe('getTrustedRedirect', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.CHAIN_IDE_LINK = 'https://ide.example.com/project/welcome';
    process.env.EXTERNAL_LOGIN_REDIRECT_ORIGINS = '';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('accepts the ChainIDE site', () => {
    expect(getTrustedRedirect('https://ide.example.com/login/callback?from=baas')).toBe(
      'https://ide.example.com/login/callback?from=baas'
    );
  });

  test('accepts the current site', () => {
    expect(getTrustedRedirect('/selectLeague')).toBe(`${window.location.origin}/selectLeague`);
    expect(getTrustedRedirect(`${window.location.origin}/about`)).toBe(`${window.location.origin}/about`);
  });

  test('accepts sites listed in EXTERNAL_LOGIN_REDIRECT_ORIGINS', () => {
    expect(getTrustedRedirect('https://partner.example.org/cb')).toBeUndefined();
    process.env.EXTERNAL_LOGIN_REDIRECT_ORIGINS = 'https://other.example.net, https://partner.example.org';
    expect(getTrustedRedirect('https://partner.example.org/cb')).toBe('https://partner.example.org/cb');
  });

  test('rejects other sites', () => {
    expect(getTrustedRedirect('https://evil.example.com/')).toBeUndefined();
    expect(getTrustedRedirect('//evil.example.com/')).toBeUndefined();
    expect(getTrustedRedirect('\\\\evil.example.com/')).toBeUndefined();
    expect(getTrustedRedirect('https://ide.example.com.evil.example.com/')).toBeUndefined();
    expect(getTrustedRedirect('https://ide.example.com@evil.example.com/')).toBeUndefined();
    // 协议或端口不同也不是同一个站点
    expect(getTrustedRedirect('http://ide.example.com/')).toBeUndefined();
    expect(getTrustedRedirect('https://ide.example.com:8443/')).toBeUndefined();
  });

  test('rejects non-http protocols', () => {
    expect(getTrustedRedirect('javascript:alert(document.domain)')).toBeUndefined();
    expect(getTrustedRedirect(' javascript:alert(document.domain)')).toBeUndefined();
    expect(getTrustedRedirect('data:text/html,<script>alert(1)</script>')).toBeUndefined();
  });

  test('rejects values that are not a single string', () => {
    expect(getTrustedRedirect(undefined)).toBeUndefined();
    expect(getTrustedRedirect(null)).toBeUndefined();
    expect(getTrustedRedirect('')).toBeUndefined();
    expect(getTrustedRedirect(['https://ide.example.com/', 'https://evil.example.com/'])).toBeUndefined();
    expect(getTrustedRedirect({ url: 'https://ide.example.com/' })).toBeUndefined();
  });

  test('ignores an invalid CHAIN_IDE_LINK', () => {
    process.env.CHAIN_IDE_LINK = 'not a url';
    expect(getTrustedRedirect('https://ide.example.com/')).toBeUndefined();
    expect(getTrustedRedirect('/selectLeague')).toBe(`${window.location.origin}/selectLeague`);
  });
});
