import React from 'react';
import { Layout } from 'antd';
import jxrjxyLogo from '~/assets/images/jiangxizhiye.png';
import styles from './index.less';

const { Header } = Layout;

export default class LoginHeader extends React.PureComponent {
  render() {
    return (
      <Header className={styles.header}>
        <div className={styles['logo-sub']}>
          <img src={jxrjxyLogo} alt="江西软件职业技术大学" />
        </div>
      </Header>
    );
  }
}
