import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Menu, message } from 'antd';
import { history } from 'umi';
import { isEmpty } from 'lodash';
import { tree2Arr } from 'utils';
import styles from './index.less';
import { MenuList } from 'utils/menu.js';
import { Roles } from 'utils/roles.js';
import { NetworkStatus } from 'utils/networkStatus';

const { SubMenu } = Menu;

function LeftMenu(props) {
  const { pathname, dispatch, User, Dashboard, Layout } = props;
  const { userRole, userInfo, networkName } = User;
  const { selectedMenu } = Layout;
  const { networkStatusInfo } = Dashboard;
  const [openKeys, setOpenKeys] = useState([]);

  const hashChange = (menu) => {
    const unavailableNetworkStatus = [NetworkStatus.NotExist, NetworkStatus.UnknownError];
    const availableMenu = ['/about/league-dashboard', '/about/elastic-cloud-server'];
    if (unavailableNetworkStatus.includes(networkStatusInfo.networkStatus) && !availableMenu.includes(menu.menuHref)) {
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
    }
  };

  const onOpenChange = (openKeys) => {
    setOpenKeys(openKeys);
  };

  const getMenuItem = (item) => {
    if (item.isFeature === 1 && userRole === Roles.NetworkMember) {
      return '';
    }
    if (item.isFeature === 2 && userInfo.role !== Roles.Admin) {
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
            if (subItem.isFeature && userRole === Roles.NetworkMember) {
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
      if (pathname.indexOf(menu.menuHref) > -1) {
        if (menu.menuPid !== 2) {
          const parentMenu = allMenu.find((item) => item.id === menu.menuPid);
          setOpenKeys([parentMenu.menuHref]);
        }
        dispatch({
          type: 'Layout/common',
          payload: { selectedMenu: menu.menuHref },
        });
        localStorage.setItem('selectedMenu', menu.menuHref);
        break;
      }
    }
    return () => {
      localStorage.setItem('selectedMenu', selectedMenu);
    };
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

export default connect(({ Layout, User, Dashboard }) => ({ Layout, User, Dashboard }))(LeftMenu);
