import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Menu } from 'antd';
import { history, Dispatch } from 'umi';
import { isEmpty } from 'lodash';
import { tree2Arr } from '~/utils';
import { CommonMenuList, CommonMenuProps, RootMenuId } from '~/utils/menu';
import { ConnectState } from '~/models/connect';
import styles from './index.less';
import { LOCAL_STORAGE_ITEM_KEY } from '~/utils/const';

const { SubMenu } = Menu;

export type CommonPortalMenuProps = {
  dispatch: Dispatch;
  pathname: string;
  User: ConnectState['User'];
  Layout: ConnectState['Layout'];
};

const CommonPortalMenu: React.FC<CommonPortalMenuProps> = (props) => {
  const { pathname, dispatch, User, Layout } = props;
  const { userInfo } = User;
  const { commonPortalSelectedMenu } = Layout;
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const hashChange = (menu: CommonMenuProps) => {
    if (pathname !== menu.menuHref) {
      history.push(menu.menuHref);
      dispatch({
        type: 'Layout/common',
        payload: { commonPortalSelectedMenu: menu.menuHref },
      });
      localStorage.setItem(LOCAL_STORAGE_ITEM_KEY.COMMON_PORTAL_SELECTED_MENU, menu.menuHref);
    }
  };

  const onOpenChange = (openKeys: any) => {
    setOpenKeys(openKeys);
  };

  const getMenuItem = (item: CommonMenuProps) => {
    if (!userInfo || !item.accessRole.includes(userInfo.role)) {
      return '';
    }
    if (isEmpty(item.subMenus)) {
      return (
        <Menu.Item
          icon={item.menuIcon}
          key={item.menuHref}
          onClick={() => hashChange(item)}>
          {item.menuName}
        </Menu.Item>
      );
    } else {
      return (
        <SubMenu
          key={item.menuHref}
          icon={item.menuIcon}
          title={item.menuName}>
          {item.subMenus.map((subItem) => {
            if (!item.accessRole.includes(userInfo.role)) {
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
    const allMenu = tree2Arr(CommonMenuList, 'subMenus');
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

  return (
    <div className={styles.leftMenu}>
      <Menu
        onOpenChange={onOpenChange}
        openKeys={openKeys}
        selectedKeys={[commonPortalSelectedMenu]}
        mode="inline">
        {CommonMenuList.map((item) => getMenuItem(item))}
      </Menu>
    </div>
  );
};

export default connect(({ Layout, User }: ConnectState) => ({
  Layout,
  User,
}))(CommonPortalMenu);
