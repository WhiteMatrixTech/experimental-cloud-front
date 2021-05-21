import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Layout as AntdLayout, Modal } from 'antd';
import { history } from 'umi';
import { NetworkPortalMenu, ServicesDrawer, TopHeader } from '~/components';
import { ModalFuncProps } from 'antd/lib/modal';
import { ConnectState } from '~/models/connect';
import styles from './index.less';

export type NetworkPortalLayoutProps = {
  children: JSX.Element;
  pathname: string;
  Layout: ConnectState['Layout'];
};

function NetworkPortalLayout(props: NetworkPortalLayoutProps) {
  const { children, pathname, Layout } = props;
  const { showDrawer } = Layout;

  const receiveMessage = (e: { key: any; newValue: any }) => {
    const { key, newValue } = e;
    if (key === 'accessToken' && newValue) {
      localStorage.setItem('newAccountLogin', 'true');
      Modal.confirm({
        title: 'Confirm',
        content: '你的账号已被登出',
        okText: '重新登录',
        onOk: onOk,
        cancelButtonProps: { disabled: true },
      });
    }
  };

  const onOk = () => {
    localStorage.removeItem('newAccountLogin');
    history.replace('/user/login');
  };

  useEffect(() => {
    window.addEventListener('storage', receiveMessage);
    return () => window.removeEventListener('storage', receiveMessage);
  }, []);

  useEffect(() => {
    let modal: {
      destroy: any;
      update?: (configUpdate: ModalFuncProps | ((prevConfig: ModalFuncProps) => ModalFuncProps)) => void;
    };
    if (localStorage.getItem('newAccountLogin')) {
      modal = Modal.confirm({
        title: '你的账号已被登出',
        okText: '重新登录',
        onOk: onOk,
        cancelButtonProps: { disabled: true },
      });
    }
    return () => {
      if (modal) {
        modal.destroy();
      }
    };
  }, []);

  return (
    <AntdLayout className="layout-style">
      <TopHeader pathname={pathname} />
      <AntdLayout>
        <div className={styles.appLayout}>
          <div className={styles.leftMenu}>
            <NetworkPortalMenu pathname={pathname} />
          </div>
          <div id="app-layout" className={styles.rightPart}>
            {children}
          </div>
          {showDrawer && <ServicesDrawer pathname={pathname} />}
        </div>
      </AntdLayout>
    </AntdLayout>
  );
}

export default connect(({ Layout }: ConnectState) => ({
  Layout,
}))(NetworkPortalLayout);
