import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import LoginHeader from '../LoginLayout/LoginHeader';
import { ConnectState } from '~/models/connect';
import { LoginLayoutProps } from '../LoginLayout';
import styles from './index.less';

const { Content } = Layout;

class LoginExternalLayout extends React.PureComponent<LoginLayoutProps> {
  render() {
    const { children } = this.props;
    return (
      <Layout
        className={styles['main-container']}
        style={{ backgroundImage: `url("${require('~/assets/images/login-external-bg.png')}")` }}>
        <LoginHeader />
        <Content className={styles['section-container']}>
          <div className={styles['section-common-wrapper']}>
            <div className={styles['user-mode']}>{children}</div>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default connect(({ Layout }: ConnectState) => ({
  Layout,
}))(LoginExternalLayout);
