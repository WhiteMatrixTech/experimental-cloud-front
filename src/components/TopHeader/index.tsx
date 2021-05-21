/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import type { Dispatch } from 'umi';
import { Layout, Menu, Dropdown } from 'antd';
import { DownOutlined, BarsOutlined } from '@ant-design/icons';
import { ConnectState } from '~/models/connect';
import buaaLogo from '~/assets/images/buaa-small.png';
import styles from './index.less';

const { Header } = Layout;

export type TopHeaderProps = {
  dispatch: Dispatch;
  pathname: string;
  User: ConnectState['User'];
  Layout: ConnectState['Layout'];
};

const TopHeader: React.FC<TopHeaderProps> = (props) => {
  const { dispatch, User, Layout } = props;
  const { userInfo } = User;
  const { showDrawer } = Layout;

  const onClickShowDrawer = () => {
    dispatch({
      type: 'Layout/common',
      payload: { showDrawer: !showDrawer },
    });
  };

  const getUserMenu = () => {
    return (
      <Menu theme="dark" onClick={handleUserMenuClick}>
        <Menu.Item key="loginOut">退出账号</Menu.Item>
      </Menu>
    );
  };

  const handleUserMenuClick = ({ key }: any) => {
    // 登出
    if (key === 'loginOut') {
      // 清空缓存
      window.localStorage.clear();
      // 跳转至登录界面
      history.replace('/user/login');
    }
  };

  return (
    <Header className={styles.header}>
      <div className={styles['logo-sub']}>
        <img src={buaaLogo} alt="北京航空大学杭州创新研究院" />
        <span>欢迎使用区块链科研实验云平台</span>
        <a className={styles['header-menu-item']} onClick={onClickShowDrawer}>
          <BarsOutlined />
          <span>服务列表</span>
        </a>
      </div>
      <div className={styles['header-right-info']}>
        <Dropdown placement="bottomCenter" overlay={getUserMenu()}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            {userInfo.loginName} <DownOutlined />
          </a>
        </Dropdown>
      </div>
    </Header>
  );
};

export default connect(({ Layout, User }: ConnectState) => ({ Layout, User }))(TopHeader);
