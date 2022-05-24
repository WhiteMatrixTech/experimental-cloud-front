import React from 'react';
import { Layout } from 'antd';
import styles from './index.less';

const { Footer } = Layout;

export default class LoginFooter extends React.PureComponent {
  render() {
    return (
      <Footer className={styles.footer}>
        <div className={styles.copyright}>Powered By DONGYIN | 江苏东印智慧工程技术研究院有限公司</div>
      </Footer>
    );
  }
}
