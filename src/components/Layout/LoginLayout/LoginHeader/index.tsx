import React from 'react';
import { Layout } from 'antd';
import nanhangLogo from '~/assets/images/nanhang-logo.png';
import styles from './index.less';

const { Header } = Layout;

export default class LoginHeader extends React.PureComponent {
  render() {
    return (
      <Header className={styles.header}>
        <div className={styles['logo-sub']}>
          <img src={nanhangLogo} alt="南京航空航天大学" />
        </div>
      </Header>
    );
  }
}
