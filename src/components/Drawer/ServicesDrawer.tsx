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
  const { showDrawer, currentService } = Layout;
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
    dispatch({
      type: 'Layout/setCurrentService',
      payload: {
        currentService: '切换联盟'
      }
    });
    onClose();
    history.replace('/selectLeague');
  };

  const onClickMenuPath = (menu: IMenuPathProps) => {
    dispatch({
      type: 'Layout/setCurrentService',
      payload: {
        selectedMenu: menu.finalPath,
        currentService: menu.finalPathName
      }
    });
    onClose();
    history.push(menu.finalPath);
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
      <Menu.Item key={menu.finalPath} onClick={() => onClickMenuPath(menu)}>
        {/* {menu.allPath.join(' > ')} */}
        {menu.finalPathName}
      </Menu.Item>
    ));
  };

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
          <div className={styles['current-service']}>{currentService}</div>
        </div>
        <div className={styles['right-service-wrapper']}>
          <Row gutter={[16, 12]}>
            <Col span={24}>所有服务</Col>
            {showNetworkMenu && (
              <Col span={4}>
                <Menu theme="dark">
                  <Menu.ItemGroup title="网络">{getNetworkMenu(optionalNetworkMenuList)}</Menu.ItemGroup>
                </Menu>
              </Col>
            )}
            <Col span={4}>
              <Menu theme="dark">
                <Menu.ItemGroup title="通用">{getNetworkMenu(optionalCommonMenuList)}</Menu.ItemGroup>
              </Menu>
            </Col>
            <Col span={4}>
              <Menu theme="dark">
                <Menu.ItemGroup title="其他">
                  {showChangeLeague && (
                    <Menu.Item key="/selectLeague" onClick={onClickChangeLeague}>
                      切换联盟
                    </Menu.Item>
                  )}
                  <Menu.Item key="DongyinIDE" onClick={onClickIDE}>
                    DongyinIDE
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
