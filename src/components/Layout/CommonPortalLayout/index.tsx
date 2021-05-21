import React from 'react';
import { connect } from 'dva';
import { Layout as AntdLayout } from 'antd';
import { TopHeader, ServicesDrawer } from '~/components';
import { ConnectState } from '~/models/connect';
import styles from './index.less';

export type BaaSLayoutProps = {
  children: JSX.Element;
  pathname: string;
  Layout: ConnectState['Layout'];
};

const CommonPortalLayout: React.FC<BaaSLayoutProps> = (props) => {
  const { children, pathname, Layout } = props;
  const { showDrawer } = Layout;

  return (
    <AntdLayout className="layout-style">
      <TopHeader pathname={pathname} />
      <AntdLayout className="layout-content">
        <div className={styles.commonPortalLayout}>
          {/* <div className={styles.leftMenu}>
            <CommonPortalMenu pathname={pathname} />
          </div> */}
          <div id="common-portal-layout" className={styles.rightPart}>
            {children}
          </div>
          {showDrawer && <ServicesDrawer pathname={pathname} />}
        </div>
      </AntdLayout>
    </AntdLayout>
  );
};

export default connect(({ Layout }: ConnectState) => ({
  Layout,
}))(CommonPortalLayout);
