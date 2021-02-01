import React, { PureComponent } from 'react';
import { connect } from "dva";
import { Layout } from 'antd';
import LoginHeader from '../LoginLayout/LoginHeader';
import styles from './index.less';

const { Content } = Layout;

class LoginExternalLayout extends PureComponent {
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
            <div className={styles['user-mode']}>{children}</div>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default connect(({ Layout }) => ({
  Layout,
}))(LoginExternalLayout);
