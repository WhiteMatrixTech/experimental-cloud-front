import React, { useMemo } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import type { Dispatch } from 'umi';
import { Layout, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { MenuList } from '@/utils/menu';
import { Roles } from '@/utils/roles';
import { ConnectState } from '@/models/connect';
import buaaLogo from 'assets/images/buaa-small.png';
import styles from './index.less';

const { Header } = Layout;

export type TopHeaderProps = {
  dispatch: Dispatch;
  pathname: string;
  User: ConnectState['User'];
};

const TopHeader: React.FC<TopHeaderProps> = (props) => {
  const { dispatch, pathname, User } = props;
  const { userInfo, userRole } = User;

  const getUserMenu = () => {
    const showChangeLeague = pathname.indexOf('about') > -1 || pathname.indexOf('userManagement') > -1;
    return (
      <Menu theme="dark" onClick={handleUserMenuClick}>
        {showChangeLeague && <Menu.Item key="changeLeague">切换联盟</Menu.Item>}
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
  const onClickIDE = (e: Event) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    const link = `${process.env.CHAIN_IDE_LINK}#${accessToken}`;
    window.open(link);
  };

  const onClickUserManagement = (e: Event) => {
    e.preventDefault();
    history.push('/userManagement');
  };

  const isSuperAdmin = useMemo(() => userRole === Roles.SuperUser, [userRole])

  return (
    <Header className={styles.header}>
      <div className={styles['logo-sub']}>
        <img src={buaaLogo} alt="北京航空大学杭州创新研究院" />
        <span>欢迎使用区块链科研实验云平台</span>
      </div>
      <div className={styles['header-right-info']}>
        {isSuperAdmin && <a className={styles['header-menu-item']} onClick={onClickUserManagement}>
          用户角色管理
        </a>}
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

export default connect(({ Layout, User }: ConnectState) => ({ Layout, User }))(TopHeader);
