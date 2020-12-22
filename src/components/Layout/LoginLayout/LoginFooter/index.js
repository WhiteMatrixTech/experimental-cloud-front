import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import styles from './index.less';

const { Footer } = Layout;

export default class LoginFooter extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }


  render() {

    return (
      <Footer className={styles.footer}>
        <div className={styles.copyright}>京公网安备06186531号 | 京ICP备05020493号-4 | 数研院技术支持 | Powered By DFI | 违法和不良信息举报电话：4006561155</div>
      </Footer >
    );
  }
}

