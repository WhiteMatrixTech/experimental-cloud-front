import React from 'react';
import { Layout } from 'antd';
import logo from '~/assets/images/dongyin-small.png';
import styles from './index.less';

const { Header } = Layout;

export default class LoginHeader extends React.PureComponent {
  render() {
    return (
      <Header className={styles.header}>
        <div className={styles['logo-sub']}>
          <img src={logo} alt="东印" />
          <span>智慧建造与运维</span>
        </div>
      </Header>
    );
  }
}
