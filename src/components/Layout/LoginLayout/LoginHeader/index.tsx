import React from 'react';
import { Layout } from 'antd';
import buaaLogo from '~/assets/images/buaa-logo.png';
import styles from './index.less';

const { Header } = Layout;

export default class LoginHeader extends React.PureComponent {
  render() {
    return (
      <Header className={styles.header}>
        <div className={styles['logo-sub']}>
          <img src={buaaLogo} alt="金陵科技学院Logo" />
        </div>
      </Header>
    );
  }
}
