import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import { TopHeader } from '@/components';
import { ConnectState } from '@/models/connect';
import { LoginLayoutProps } from '../LoginLayout';
import styles from './index.less';

class LeaguePageLayout extends React.PureComponent<LoginLayoutProps> {

  render() {
    const { children, pathname } = this.props;
    return (
      <Layout className="layout-style">
        <TopHeader pathname={pathname} />
        <Layout>
          <div className={styles.appLayout}>
            <div id="league-list-layout" className={styles.rightPart}>
              {children}
            </div>
          </div>
        </Layout>
      </Layout>
    );
  }
}

export default connect(({ Layout }: ConnectState) => ({
  Layout,
}))(LeaguePageLayout);
