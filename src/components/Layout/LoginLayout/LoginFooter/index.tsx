import React from 'react';
import { Layout } from 'antd';
import styles from './index.less';

const { Footer } = Layout;

export default class LoginFooter extends React.PureComponent {

  render() {
    return (
      <Footer className={styles.footer}>
        <div className={styles.copyright}>版权所有©️金陵科技学院  All Rights Reserved.</div>
      </Footer>
    );
  }
}
