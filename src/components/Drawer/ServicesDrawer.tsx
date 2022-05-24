import React, { useMemo } from 'react';
import { Drawer, Menu, Row, Col } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '~/models/connect';
import { Dispatch, history } from 'umi';
import { NetworkMenuPath, CommonMenuPath, IMenuPathProps } from '~/utils/menu';
import { LOCAL_STORAGE_ITEM_KEY } from '~/utils/const';
import styles from './ServicesDrawer.less';
import { getTokenData } from '~/utils/encryptAndDecrypt';

export type ServicesDrawerProps = {
  dispatch: Dispatch;
  pathname: string;
  User: ConnectState['User'];
  Layout: ConnectState['Layout'];
};

const bodyStyle = {
  padding: 0,
  margin: 24,
  overflow: 'hidden auto'
};

const ServicesDrawer: React.FC<ServicesDrawerProps> = (props) => {
  const { dispatch, pathname, User, Layout } = props;
  const { showDrawer } = Layout;
  const { userInfo, userRole, networkName } = User;

  const onClose = () => {
    dispatch({
      type: 'Layout/common',
      payload: { showDrawer: false }
    });
  };

  // 跳转至IDE
  const onClickIDE = () => {
    const { accessToken } = getTokenData();
    let link = `${process.env.CHAIN_IDE_LINK}#${accessToken}`;
    link = networkName ? `${link}?networkName=${networkName}` : link;
    onClose();
    window.open(link);
  };

  const onClickChangeLeague = () => {
    localStorage.removeItem(LOCAL_STORAGE_ITEM_KEY.ROLE_TOKEN);
    dispatch({
      type: 'User/cleanNetworkInfo',
      payload: {}
    });
    onClose();
    history.replace('/selectLeague');
  };

  const onClickMenuPath = (path: string) => {
    dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: path }
    });
    onClose();
    history.push(path);
  };

  const showNetworkMenu = useMemo(() => pathname.indexOf('/selectLeague') === -1 && networkName, [
    pathname,
    networkName
  ]);
  const showChangeLeague = useMemo(() => pathname.indexOf('/selectLeague') === -1, [pathname]);

  const optionalNetworkMenuList = useMemo(() => {
    return NetworkMenuPath.filter((path) => path.pathAccess.includes(userRole));
  }, [userRole]);

  const optionalCommonMenuList = useMemo(() => {
    if (!userInfo) {
      return [];
    }
    return CommonMenuPath.filter((path) => path.pathAccess.includes(userInfo.role));
  }, [userInfo]);

  const getNetworkMenu = (menuList: IMenuPathProps[]) => {
    return menuList.map((menu) => (
      <Menu.Item key={menu.finalPath} onClick={() => onClickMenuPath(menu.finalPath)}>
        {/* {menu.allPath.join(' > ')} */}
        {menu.finalPathName}
      </Menu.Item>
    ));
  };

  const currentServices = useMemo(() => {
    const service = {
      servicePath: '',
      serviceName: ''
    };
    if (pathname === '/selectLeague') {
      service.servicePath = '/selectLeague';
      service.serviceName = '切换联盟';
      return service;
    }
    const findResult = optionalNetworkMenuList
      .concat(optionalCommonMenuList)
      .find((menu) => menu.finalPath === pathname);
    if (findResult) {
      service.servicePath = findResult.finalPath;
      service.serviceName = findResult.finalPathName;
    }
    return service;
  }, [optionalCommonMenuList, optionalNetworkMenuList, pathname]);

  return (
    <Drawer
      placement="top"
      height={500}
      closable={false}
      onClose={onClose}
      visible={showDrawer}
      bodyStyle={bodyStyle}
      getContainer={false}
      style={{ position: 'absolute' }}
      className={styles['services-drawer']}>
      <div className={styles['service-wrapper']}>
        <div className={styles['left-service-wrapper']}>
          <div>当前服务</div>
          <div className={styles['current-service']}>{currentServices.serviceName}</div>
        </div>
        <div className={styles['right-service-wrapper']}>
          <Row gutter={[16, 12]}>
            <Col span={24}>所有服务</Col>
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
                    <Menu.Item key="/selectLeague" onClick={onClickChangeLeague}>
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
        </div>
      </div>
    </Drawer>
  );
};

export default connect(({ Layout, User }: ConnectState) => ({ Layout, User }))(ServicesDrawer);
