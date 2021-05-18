import React, { useMemo } from 'react';
import { Drawer, Menu, Row, Col } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Dispatch, history } from 'umi';
import { NetworkMenuPath, CommonMenuPath, IMenuPathProps } from '@/utils/menu';
import styles from './ServicesDrawer.less';

export type ServicesDrawerProps = {
  dispatch: Dispatch;
  pathname: string;
  User: ConnectState['User'];
  Layout: ConnectState['Layout'];
};

const bodyStyle = {
  padding: 0,
  margin: 24,
  overflowY: 'auto',
  overflowX: 'hidden',
};

const ServicesDrawer: React.FC<ServicesDrawerProps> = (props) => {
  const { dispatch, pathname, User, Layout } = props;
  const { showDrawer } = Layout;
  const { userInfo, userRole, networkName } = User;

  const onClose = () => {
    dispatch({
      type: 'Layout/common',
      payload: { showDrawer: false },
    });
  };

  // 跳转至IDE
  const onClickIDE = () => {
    const accessToken = localStorage.getItem('accessToken');
    const link = `${process.env.CHAIN_IDE_LINK}#${accessToken}`;
    onClose();
    window.open(link);
  };

  const onClickChangeLeague = () => {
    localStorage.setItem('roleToken', '');
    localStorage.setItem('leagueName', '');
    localStorage.setItem('networkName', '');
    dispatch({
      type: 'User/cleanNetworkInfo',
      payload: {},
    });
    onClose();
    history.replace('/selectLeague');
  };

  const onClickMenuPath = (path: string) => {
    dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: path },
    });
    onClose();
    history.push(path);
  };

  const showNetworkMenu = useMemo(() => pathname.indexOf('/selectLeague') === -1 && networkName, [
    pathname,
    networkName,
  ]);
  const showChangeLeague = useMemo(() => pathname.indexOf('/selectLeague') === -1, [pathname]);

  const optionalNetworkMenuList = useMemo(() => {
    return NetworkMenuPath.filter((path) => path.pathAccess.includes(userRole));
  }, [userRole]);

  const optionalCommonMenuList = useMemo(() => {
    return CommonMenuPath.filter((path) => path.pathAccess.includes(userInfo.role));
  }, [userInfo.role]);

  const getNetworkMenu = (menuList: IMenuPathProps[]) => {
    return menuList.map((menu) => (
      <Menu.Item key={menu.finalPath} onClick={() => onClickMenuPath(menu.finalPath)}>
        {/* {menu.allPath.join(' > ')} */}
        {menu.finalPathName}
      </Menu.Item>
    ));
  };

  return (
    <Drawer
      title="All Pages"
      placement="top"
      height={500}
      closable={false}
      onClose={onClose}
      visible={showDrawer}
      bodyStyle={bodyStyle}
      getContainer={false}
      style={{ position: 'absolute' }}
      className={styles['services-drawer']}
    >
      <Row gutter={[16, 24]}>
        {showNetworkMenu && (
          <Col span={4}>
            <Menu>
              <Menu.ItemGroup title="网络">{getNetworkMenu(optionalNetworkMenuList)}</Menu.ItemGroup>
            </Menu>
          </Col>
        )}
        <Col span={4}>
          <Menu>
            <Menu.ItemGroup title="通用">{getNetworkMenu(optionalCommonMenuList)}</Menu.ItemGroup>
          </Menu>
        </Col>
        <Col span={4}>
          <Menu>
            <Menu.ItemGroup title="其他">
              {showChangeLeague && (
                <Menu.Item key="ChangeLeague" onClick={onClickChangeLeague}>
                  切换联盟
                </Menu.Item>
              )}
              <Menu.Item key="ChainIDE" onClick={onClickIDE}>
                ChainIDE
              </Menu.Item>
            </Menu.ItemGroup>
          </Menu>
        </Col>
      </Row>
    </Drawer>
  );
};

export default connect(({ Layout, User }: ConnectState) => ({ Layout, User }))(ServicesDrawer);
