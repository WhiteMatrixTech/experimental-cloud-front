import React from 'react';
import { connect } from 'dva';
import { Dispatch } from 'umi';
import { Layout as AntdLayout } from 'antd';
import { TopHeader, ServicesDrawer, CommonPortalMenu } from '~/components';
import { ConnectState } from '~/models/connect';
import styles from './index.less';

export type BaaSLayoutProps = {
  children: JSX.Element;
  pathname: string;
  dispatch: Dispatch;
  Layout: ConnectState['Layout'];
};

const CommonPortalLayout: React.FC<BaaSLayoutProps> = (props) => {
  const { children, pathname, dispatch, Layout } = props;
  const { showDrawer } = Layout;


  const handleScroll = (event: any) => {
    // 页面高度
    const scrollHeight = (event.target && event.target.scrollTop) || document.body.scrollTop;
    if (scrollHeight < 1000) {
      dispatch({
        type: 'BlockChainCompile/common',
        payload: {
          backTopVisible: false
        }
      });
    } else {
      dispatch({
        type: 'BlockChainCompile/common',
        payload: {
          backTopVisible: true
        }
      });
    }
  }

  return (
    <AntdLayout className="layout-style">
      <TopHeader pathname={pathname} />
      <AntdLayout className="layout-content">
        <div className={styles.commonPortalLayout}>
          {/* <div className={styles.leftMenu}>
            <CommonPortalMenu pathname={pathname} />
          </div> */}
          <div
            id="common-portal-layout"
            onScroll={handleScroll}
            className={styles.rightPart}>
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
