import React from 'react';
import { Layout } from 'antd';
import wuhanLogo from '~/assets/images/wuhan-logo.png';
import styles from './index.less';

const { Header } = Layout;

export default class LoginHeader extends React.PureComponent {
  render() {
    return (
      <Header className={styles.header}>
        <div className={styles['logo-sub']}>
          <img src={wuhanLogo} alt="武汉大学" />
        </div>
      </Header>
    );
  }
}
