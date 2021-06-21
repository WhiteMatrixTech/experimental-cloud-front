import React from 'react';
import { Layout } from 'antd';
import styles from './index.less';
import { Intl } from '~/utils/locales';

const { Footer } = Layout;

export default class LoginFooter extends React.PureComponent {
  render() {
    return (
      <Footer className={styles.footer}>
        <div className={styles.copyright}>
          Powered By BUAA | {Intl.formatMessage('BASS_MENU_BAD_INFORMATION_REPORT_TELEPHONE')}：0571-85366069
        </div>
      </Footer>
    );
  }
}
