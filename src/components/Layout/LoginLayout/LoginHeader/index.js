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
        <div className={styles['logo-sub']}>欢迎使用区块链实验云服务平台</div>
      </Header >
    );
  }
}

