import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Layout, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { MenuList } from 'utils/menu.js';
import { Roles } from 'utils/roles.js';
import styles from './index.less';

const { Header } = Layout;

class TopHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getUserMenu = () => {
    const showChangeLeague = window.location.pathname.indexOf('about') > -1;
    return (
      <Menu theme="dark" onClick={this.handleUserMenuClick}>
        {showChangeLeague && <Menu.Item key="changeLeague">切换联盟</Menu.Item>}
        <Menu.Item key="loginOut">退出账号</Menu.Item>
      </Menu>
    );
  };

  handleUserMenuClick = ({ key }) => {
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
  onClickMessage = () => {
    const breadCrumbItem = MenuList.filter((item) => item.menuHref.indexOf('/about/message') > -1);
    this.props.dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: '/about/message', breadCrumbItem },
    });
    const hashName = window.location.hash;
    if (hashName.indexOf('/about/message') === -1) {
      history.push('/about/message');
    }
  };

  // 跳转至IDE
  onClickIDE = (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    const link = `${process.env.CHAIN_IDE_LINK}#${accessToken}`;
    window.open(link);
  };

  onClickIpfs = (e) => {
    e.preventDefault();
    const link = 'http://49.72.212.42:8060/ipfs/QmXc9raDM1M5G5fpBnVyQ71vR4gbnskwnB9iMEzBuLgvoZ/#/';
    window.open(link);
  };

  render() {
    const { userInfo, userRole } = this.props.User;
    return (
      <Header className={styles.header}>
        <div className={styles['logo-sub']}>欢迎使用扬子江数字金融Baas区块链管理平台</div>
        <div className={styles['header-right-info']}>
          {userRole === Roles.NetworkAdmin && (
            <a className={styles['header-menu-item']} onClick={this.onClickIpfs}>
              IPFS
            </a>
          )}
          <a className={styles['header-menu-item']} onClick={this.onClickIDE}>
            ChainIDE
          </a>
          {/* <Badge showZero count={100}>
            <div className={styles['header-menu-item']} style={{ paddingRight: '12px' }} onClick={this.onClickMessage}>消息</div>
          </Badge> */}
          <Dropdown placement="bottomCenter" overlay={this.getUserMenu()}>
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              {userInfo.loginName} <DownOutlined />
            </a>
          </Dropdown>
        </div>
      </Header>
    );
  }
}

export default connect(({ Layout, User }) => ({ Layout, User }))(TopHeader);
