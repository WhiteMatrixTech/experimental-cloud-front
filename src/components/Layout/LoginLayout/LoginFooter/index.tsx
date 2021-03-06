import React from 'react';
import { Layout } from 'antd';
import styles from './index.less';

const { Footer } = Layout;

export default class LoginFooter extends React.PureComponent {

  render() {
    return (
      <Footer className={styles.footer}>
        <div className={styles.copyright}>Powered By BUAA | 违法和不良信息举报电话：0571-85366069</div>
      </Footer>
    );
  }
}
