import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Menu, message } from 'antd';
import { history } from 'umi';
import { isEmpty } from 'lodash';
import type { Dispatch } from 'umi';
import { tree2Arr } from '@/utils';
import { MenuList, MenuProps } from '@/utils/menu';
import { Roles } from '@/utils/roles';
import { NetworkStatus } from '@/utils/networkStatus';
import { ConnectState } from '@/models/connect';
import styles from './index.less';

const { SubMenu } = Menu;

export type LeftMenuProps = {
  dispatch: Dispatch,
  pathname: string,
  User: ConnectState['User'],
  Layout: ConnectState['Layout'],
  Dashboard: ConnectState['Dashboard'],
}

const LeftMenu: React.FC<LeftMenuProps> = (props) => {
  const { pathname, dispatch, User, Dashboard, Layout } = props;
  const { userRole, userInfo, networkName } = User;
  const { selectedMenu } = Layout;
  const { networkStatusInfo } = Dashboard;
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const hashChange = (menu: MenuProps) => {
    const unavailableNetworkStatus = [NetworkStatus.NotExist, NetworkStatus.UnknownError];
    const availableMenu = ['/about/league-dashboard', '/about/elastic-cloud-server'];
    if (networkStatusInfo && unavailableNetworkStatus.includes(networkStatusInfo.networkStatus) && !availableMenu.includes(menu.menuHref)) {
      const warnMes = userRole === Roles.NetworkAdmin ? '请先创建网络' : '请等待盟主创建网络';
      message.warn(warnMes);
      return;
    }
    if (pathname !== menu.menuHref) {
      history.push(menu.menuHref);
      dispatch({
        type: 'Layout/common',
        payload: { selectedMenu: menu.menuHref },
      });
      localStorage.setItem('selectedMenu', menu.menuHref);
    }
  };

  const onOpenChange = (openKeys: any) => {
    setOpenKeys(openKeys);
  };

  const getMenuItem = (item: MenuProps) => {
    if (item.accessRole === Roles.NetworkMember && userRole === Roles.NetworkMember) {
      return '';
    }
    if (item.accessRole === Roles.Admin && userInfo.role !== Roles.Admin) {
      return '';
    }
    if (isEmpty(item.menuVos)) {
      return (
        <Menu.Item key={item.menuHref} onClick={() => hashChange(item)}>
          <i className={`icon-menu-width KBass ${item.menuIcon}`}></i>
          <span>{item.menuName}</span>
        </Menu.Item>
      );
    } else {
      return (
        <SubMenu
          key={item.menuHref}
          title={
            <div className={styles.menuTitle}>
              <i className={`icon-menu-width KBass ${item.menuIcon}`}></i>
              <span>{item.menuName}</span>
            </div>
          }
        >
          {item.menuVos.map((subItem) => {
            if (subItem.accessRole !== Roles.NetworkMember && userRole === Roles.NetworkMember) {
              return '';
            }
            return (
              <Menu.Item key={subItem.menuHref} onClick={() => hashChange(subItem)}>
                <span style={{ paddingLeft: '8px' }}>{subItem.menuName}</span>
              </Menu.Item>
            );
          })}
        </SubMenu>
      );
    }
  };

  useEffect(() => {
    const allMenu = tree2Arr(MenuList, 'menuVos');
    const menuLen = allMenu.length;
    for (let i = 0; i < menuLen; i++) {
      const menu = allMenu[i];
      if (menu.menuHref.indexOf(pathname) > -1 && menu.menuPid !== 2) {
        const parentMenu = allMenu.find((item) => item.id === menu.menuPid);
        setOpenKeys([parentMenu.menuHref]);
        break;
      }
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: 'Dashboard/getNetworkInfo',
      payload: {
        networkName: networkName,
      },
    });
  }, []);

  return (
    <div className={styles.leftMenu}>
      <Menu onOpenChange={onOpenChange} openKeys={openKeys} selectedKeys={[selectedMenu]} mode="inline" theme="dark">
        {MenuList.map((item) => getMenuItem(item))}
      </Menu>
    </div>
  );
}

export default connect(({ Layout, User, Dashboard }: ConnectState) => ({
  Layout,
  User,
  Dashboard
}))(LeftMenu);
