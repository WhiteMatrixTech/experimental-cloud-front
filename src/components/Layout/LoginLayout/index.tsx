import React from 'react';
import { Layout } from 'antd';
import LoginHeader from './LoginHeader';
import LoginFooter from './LoginFooter';
import styles from './index.less';

const { Content } = Layout;

export type LoginLayoutProps = {
  children: JSX.Element;
  pathname: string;
};

class LoginLayout extends React.PureComponent<LoginLayoutProps> {
  render() {
    const { children } = this.props;
    return (
      <Layout
        className={styles['main-container']}
        style={{
          backgroundImage: `url("${require('~/assets/images/loginBg.png')}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
        <div className={styles['background-mask']}> </div>
        <LoginHeader />
        <Content className={styles['section-container']}>
          <div className={styles['website-name']}>
            <div className={styles['login-dec-01']}>
              <span>区块链</span>
            </div>
            <div className={styles['login-dec-02']}> 应用服务平台 </div>
          </div>
          <div className={styles['section-common-wrapper']}>
            <div className={styles['user-mode']}>{children}</div>
          </div>
        </Content>
        <LoginFooter />
      </Layout>
    );
  }
}

export default LoginLayout;
