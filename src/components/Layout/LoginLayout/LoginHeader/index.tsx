import React from 'react';
import { Layout } from 'antd';
import logo from '~/assets/images/masi-small.png';
import styles from './index.less';

const { Header } = Layout;

export default class LoginHeader extends React.PureComponent {
  render() {
    return (
      <Header className={styles.header}>
        <div className={styles['logo-sub']}>
          <img src={logo} alt="码思IDEA-CODE" />
          <span>定制化行业服务商</span>
        </div>
      </Header>
    );
  }
}
