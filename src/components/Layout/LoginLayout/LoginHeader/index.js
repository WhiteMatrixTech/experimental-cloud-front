import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import styles from './index.less';

const { Header } = Layout;

export default class LoginHeader extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }


  render() {

    return (
      <Header className={styles.header}>
        <div className={styles['logo-sub']}>欢迎使用扬子江数字金融平台区块链BaaS服务</div>
      </Header >
    );
  }
}

