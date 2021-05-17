/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { connect } from 'dva';
import { history, Portal, PortalNames } from 'umi';
import type { Dispatch } from 'umi';
import { Layout, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { ConnectState } from '@/models/connect';
import buaaLogo from 'assets/images/buaa-small.png';
import styles from './index.less';

const { Header } = Layout;

export type TopHeaderProps = {
  dispatch: Dispatch;
  pathname: string;
  User: ConnectState['User'];
  Layout: ConnectState['Layout'];
};

const TopHeader: React.FC<TopHeaderProps> = (props) => {
  const { dispatch, pathname, User, Layout } = props;
  const { userInfo, networkName } = User;
  const { currentPortal } = Layout;

  const getUserMenu = () => {
    // 当前在网络门户下才展示切换网络
    const showChangeLeague = pathname.indexOf('about') > -1 && currentPortal === Portal.NetworkPortal;
    return (
      <Menu theme="dark" onClick={handleUserMenuClick}>
        {showChangeLeague && <Menu.Item key="changeLeague">切换联盟</Menu.Item>}
        <Menu.Item key="loginOut">退出账号</Menu.Item>
      </Menu>
    );
  };

  const getPortalMenu = () => {
    const portalList = Object.keys(PortalNames).filter((portal) => portal !== currentPortal);
    return (
      <Menu theme="dark" onClick={handlePortalMenuClick}>
        {portalList.map((portal) => (
          <Menu.Item key={portal}>{PortalNames[portal].portalName}</Menu.Item>
        ))}
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
    } else if (key === 'changeLeague') {
      localStorage.setItem('roleToken', '');
      localStorage.setItem('leagueName', '');
      localStorage.setItem('networkName', '');
      dispatch({
        type: 'User/cleanNetworkInfo',
        payload: {},
      });
      history.replace('/selectLeague');
    }
  };

  const handlePortalMenuClick = ({ key }: any) => {
    if (currentPortal === Portal.CommonPortal && !networkName) {
      history.push('/selectLeague');
    } else {
      history.push(PortalNames[key].path);
    }
    dispatch({
      type: 'Layout/common',
      payload: {
        currentPortal: key,
        commonPortalSelectedMenu: '/common/job-management',
        selectedMenu: '/about/league-dashboard',
      },
    });
  };

  // 跳转至IDE
  const onClickIDE = (e: any) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    const link = `${process.env.CHAIN_IDE_LINK}#${accessToken}`;
    window.open(link);
  };

  return (
    <Header className={styles.header}>
      <div className={styles['logo-sub']}>
        <img src={buaaLogo} alt="北京航空大学杭州创新研究院" />
        <span>欢迎使用区块链科研实验云平台</span>
      </div>
      <div className={styles['header-right-info']}>
        <a className={styles['header-menu-item']} onClick={onClickIDE}>
          ChainIDE
        </a>
        <Dropdown placement="bottomCenter" overlay={getPortalMenu()}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            切换Portal <DownOutlined />
          </a>
        </Dropdown>
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
