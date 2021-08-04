import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Menu, message } from 'antd';
import { history } from 'umi';
import { isEmpty } from 'lodash';
import type { Dispatch } from 'umi';
import { tree2Arr } from '~/utils';
import { MenuList, NetworkMenuProps, RootMenuId } from '~/utils/menu';
import { Roles } from '~/utils/roles';
import { NetworkStatus } from '~/utils/networkStatus';
import { ConnectState } from '~/models/connect';
import styles from './index.less';
import { LOCAL_STORAGE_ITEM_KEY } from '~/utils/const';

const { SubMenu } = Menu;

export type LeftMenuProps = {
  dispatch: Dispatch;
  pathname: string;
  User: ConnectState['User'];
  Layout: ConnectState['Layout'];
  Dashboard: ConnectState['Dashboard'];
};

const NetworkPortalMenu: React.FC<LeftMenuProps> = (props) => {
  const { pathname, dispatch, User, Dashboard, Layout } = props;
  const { userRole, networkName } = User;
  const { selectedMenu } = Layout;
  const { networkStatusInfo } = Dashboard;
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const hashChange = (menu: NetworkMenuProps) => {
    const unavailableNetworkStatus = [NetworkStatus.NotExist, NetworkStatus.UnknownError];
    const availableMenu = ['/about/league-dashboard', '/about/elastic-cloud-server'];
    if (
      networkStatusInfo &&
      unavailableNetworkStatus.includes(networkStatusInfo.networkStatus) &&
      !availableMenu.includes(menu.menuHref)
    ) {
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
      localStorage.setItem(LOCAL_STORAGE_ITEM_KEY.NETWORK_PORTAL_SELECTED_MENU, menu.menuHref);
    }
  };

  const onOpenChange = (openKeys: any) => {
    setOpenKeys(openKeys);
  };

  const getMenuItem = (item: NetworkMenuProps) => {
    if (!item.accessRole.includes(userRole)) {
      return '';
    }
    if (isEmpty(item.subMenus)) {
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
          {item.subMenus.map((subItem) => {
            if (!item.accessRole.includes(userRole)) {
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
    const allMenu = tree2Arr(MenuList, 'subMenus');
    const menuLen = allMenu.length;
    for (let i = 0; i < menuLen; i++) {
      const menu = allMenu[i];
      if (menu.menuHref.indexOf(pathname) > -1 && menu.menuPid !== RootMenuId) {
        const parentMenu = allMenu.find((item) => item.id === menu.menuPid);
        setOpenKeys([parentMenu.menuHref]);
        break;
      }
    }
  }, [pathname]);

  useEffect(() => {
    dispatch({
      type: 'Dashboard/getNetworkInfo',
      payload: {
        networkName: networkName,
      },
    });
  }, [dispatch, networkName]);

  return (
    <div className={styles.leftMenu}>
      <Menu onOpenChange={onOpenChange} openKeys={openKeys} selectedKeys={[selectedMenu]} mode="inline" theme="dark">
        {MenuList.map((item) => getMenuItem(item))}
      </Menu>
    </div>
  );
};

export default connect(({ Layout, User, Dashboard }: ConnectState) => ({
  Layout,
  User,
  Dashboard,
}))(NetworkPortalMenu);
