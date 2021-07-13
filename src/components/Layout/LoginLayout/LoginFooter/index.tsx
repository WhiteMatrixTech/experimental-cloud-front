import React from 'react';
import { Layout } from 'antd';
import styles from './index.less';

const { Footer } = Layout;

export default class LoginFooter extends React.PureComponent {

  render() {
    return (
      <Footer className={styles.footer}>
        <div className={styles.copyright}>版权所有：南京航空航天大学 ALL RIGHTS RESERVED</div>
      </Footer>
    );
  }
}
