import React from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Layout, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { MenuList } from 'utils/menu.js';
import buaaLogo from 'assets/images/buaa-small.png';
import styles from './index.less';

const { Header } = Layout;

function TopHeader(props) {
  const { dispatch, User } = props;
  const { userInfo } = User;

  const getUserMenu = () => {
    const showChangeLeague = window.location.pathname.indexOf('about') > -1;
    return (
      <Menu theme="dark" onClick={handleUserMenuClick}>
        {showChangeLeague && <Menu.Item key="changeLeague">切换联盟</Menu.Item>}
        <Menu.Item key="loginOut">退出账号</Menu.Item>
      </Menu>
    );
  };

  const handleUserMenuClick = ({ key }) => {
    // 登出
    if (key === 'loginOut') {
      // 清空缓存
      window.localStorage.clear();
      // 跳转至登录界面
      history.replace('/user/login');
    } else if (key === 'changeLeague') {
      window.localStorage.setItem('roleToken', '');
      history.replace('/selectLeague');
    }
  };

  // 查看消息
  const onClickMessage = () => {
    const breadCrumbItem = MenuList.filter((item) => item.menuHref.indexOf('/about/message') > -1);
    dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: '/about/message', breadCrumbItem },
    });
    const hashName = window.location.hash;
    if (hashName.indexOf('/about/message') === -1) {
      history.push('/about/message');
    }
  };

  // 跳转至IDE
  const onClickIDE = (e) => {
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
        {/* <Badge showZero count={100}>
            <div className={styles['header-menu-item']} style={{ paddingRight: '12px' }} onClick={onClickMessage}>消息</div>
          </Badge> */}
        <Dropdown placement="bottomCenter" overlay={getUserMenu()}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            {userInfo.loginName} <DownOutlined />
          </a>
        </Dropdown>
      </div>
    </Header>
  );
}

export default connect(({ Layout, User }) => ({ Layout, User }))(TopHeader);
