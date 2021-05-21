import React from 'react';
import { connect } from 'dva';
import { Layout as AntdLayout } from 'antd';
import { ServicesDrawer, TopHeader } from '~/components';
import { ConnectState } from '~/models/connect';
import { NetworkPortalLayoutProps } from '../NetworkPortalLayout';
import styles from './index.less';
class LeaguePageLayout extends React.PureComponent<NetworkPortalLayoutProps> {
  render() {
    const { children, pathname, Layout } = this.props;
    const { showDrawer } = Layout;
    return (
      <AntdLayout className="layout-style">
        <TopHeader pathname={pathname} />
        <AntdLayout className="layout-content">
          <div className={styles.appLayout}>
            <div id="league-list-layout" className={styles.rightPart}>
              {children}
            </div>
            {showDrawer && <ServicesDrawer pathname={pathname} />}
          </div>
        </AntdLayout>
      </AntdLayout>
    );
  }
}

export default connect(({ Layout }: ConnectState) => ({
  Layout,
}))(LeaguePageLayout);
