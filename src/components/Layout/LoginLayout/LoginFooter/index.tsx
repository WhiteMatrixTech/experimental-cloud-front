import React from 'react';
import { Layout } from 'antd';
import styles from './index.less';

const { Footer } = Layout;

export default class LoginFooter extends React.PureComponent {

  render() {
    return (
      <Footer className={styles.footer}>
        <div className={styles.copyright}>学校地址：江西省南昌市先锋创客小镇  |  邮编：330041  |  电话：0791-83792966  |  传真：0791-87709377  |  ©2020 江西软件职业技术大学版权所有</div>
      </Footer>
    );
  }
}
