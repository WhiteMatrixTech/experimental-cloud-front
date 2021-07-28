import React from 'react';
import { Layout } from 'antd';
import styles from './index.less';

const { Footer } = Layout;

export default class LoginFooter extends React.PureComponent {

  render() {
    return (
      <Footer className={styles.footer}>
        <div className={styles.copyright}>
          版权所有© 2021 北京航空航天大学杭州创新研究院 <a href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer">浙ICP备20002571号-4</a>
        </div>
      </Footer>
    );
  }
}
