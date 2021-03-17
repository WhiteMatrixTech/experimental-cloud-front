import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Layout, Modal } from 'antd';
import { history } from 'umi';
import { LeftMenu, TopHeader } from 'components';
import styles from './Layout.less';

function BaaSLayout(props) {
  const { children, pathname } = props;

  const receiveMessage = (e) => {
    const { key, newValue } = e;
    if (key === 'accessToken' && newValue) {
      localStorage.setItem('newAccountLogin', true);
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
    let modal = null;
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
    <Layout className="layout-style">
      <TopHeader />
      <Layout>
        <div className={styles.appLayout}>
          <div className={styles.leftMenu}>
            <LeftMenu pathname={pathname} />
          </div>
          <div id="app-layout" className={styles.rightPart}>
            {children}
          </div>
        </div>
      </Layout>
    </Layout>
  );
}

export default connect(({ Layout }) => ({
  Layout,
}))(BaaSLayout);
