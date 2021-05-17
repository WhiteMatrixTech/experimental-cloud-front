import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import { CommonPortalMenu, TopHeader } from '@/components';
import { ConnectState } from '@/models/connect';
import styles from './index.less';

export type BaaSLayoutProps = {
  children: JSX.Element;
  pathname: string;
};

const CommonPortalLayout: React.FC<BaaSLayoutProps> = (props) => {
  const { children, pathname } = props;

  return (
    <Layout className="layout-style">
      <TopHeader pathname={pathname} />
      <Layout>
        <div className={styles.commonPortalLayout}>
          <div className={styles.leftMenu}>
            <CommonPortalMenu pathname={pathname} />
          </div>
          <div id="common-portal-layout" className={styles.rightPart}>
            {children}
          </div>
        </div>
      </Layout>
    </Layout>
  );
};

export default connect(({ Layout }: ConnectState) => ({
  Layout,
}))(CommonPortalLayout);
