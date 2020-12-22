import React, { PureComponent } from 'react';
import { connect } from "dva";
import { Layout } from 'antd';
import LoginHeader from './LoginHeader';
import LoginFooter from './LoginFooter';
import styles from './index.less';

const { Content } = Layout;

class LoginLayout extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { children } = this.props;
    return (
      <Layout className={styles['main-container']}>
        <LoginHeader />
        <Content className={styles['section-container']}>
          <div className={styles['section-common-wrapper']}>
            <div className={styles['login-mode']}>
              <div className={styles['login-dec-01']}>
                <span>扬子江数字金融平台</span>
              </div>
              <div className={styles['login-dec-02']}> 区块链服务 </div>
            </div>
            <div className={styles['user-mode']}>{children}</div>
          </div>
        </Content>
        <LoginFooter />
      </Layout>
    );
  }
}

export default connect(({ Layout }) => ({
  Layout,
}))(LoginLayout);
