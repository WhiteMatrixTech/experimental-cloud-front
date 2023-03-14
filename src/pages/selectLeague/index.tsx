import React, { useState, useMemo, useCallback } from 'react';
import { history, connect, Dispatch, LeagueSchema } from 'umi';
import { useRafInterval, useUnmount } from 'ahooks';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Row, Col, Button, Spin, Empty, Divider, Pagination, Tooltip, Alert } from 'antd';
import CreateLeague from './components/CreateLeague';
import { LeagueCard } from './components/LeagueCard';
import { ConnectState } from '~/models/connect';
import { Roles } from '~/utils/roles';
import { LOCAL_STORAGE_ITEM_KEY } from '~/utils/const';
import { deviceId, encryptData } from '~/utils/encryptAndDecrypt';
import styles from './index.less';

const AdminRole = [Roles.ADMIN, Roles.SUPER];

export type SelectLeagueProps = {
  qryLoading: boolean;
  dispatch: Dispatch;
  User: ConnectState['User'];
  Cluster: ConnectState['Cluster'];
};

const SelectLeague: React.FC<SelectLeagueProps> = (props) => {
  const { dispatch, User, Cluster, qryLoading = false } = props;
  const { clusterTotal } = Cluster;
  const { userInfo, notJointedNetworkList, myCreatedNetworkList, myJoinedNetworkList } = User;

  const [createVisible, setCreateVisible] = useState(false);
  const [myLeaguePageNum, setMyLeaguePageNum] = useState(1);
  const [joinedLeaguePageNum, setJoinedLeaguePageNum] = useState(1);
  const [optionLeaguePageNum, setOptionLeaguePageNum] = useState(1);

  const getLeagueList = useCallback(() => {
    dispatch({
      type: 'User/getNotJointedNetworkList',
      payload: {}
    });
    dispatch({
      type: 'User/getMyNetworkList',
      payload: {}
    });
  }, [dispatch]);

  const clearInterval = useRafInterval(
    () => {
      getLeagueList();
    },
    10000,
    { immediate: true }
  );

  useUnmount(() => {
    clearInterval();
  });

  const onMyLeaguePageChange = (page: number) => {
    setMyLeaguePageNum(page);
  };
  const onJoinedLeaguePageChange = (page: number) => {
    setJoinedLeaguePageNum(page);
  };
  const onOptionLeaguePageChange = (page: number) => {
    setOptionLeaguePageNum(page);
  };

  const onCancelCreate = (label: boolean) => {
    setCreateVisible(false);
    if (label) {
      getLeagueList();
    }
  };
  const onClickCreate = () => {
    setCreateVisible(true);
  };

  // 点击联盟进入系统
  const onClickLeague = (league: LeagueSchema) => {
    dispatch({
      type: 'User/common',
      payload: {
        userRole: league.role,
        networkName: league.networkName,
        leagueName: league.leagueName
      }
    });
    dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: '/about/league-dashboard' }
    });
    localStorage.setItem(LOCAL_STORAGE_ITEM_KEY.USER_ROLE_IN_NETWORK, encryptData(league.role as Roles, deviceId));
    localStorage.setItem(LOCAL_STORAGE_ITEM_KEY.LEAGUE_NAME, encryptData(league.leagueName, deviceId));
    localStorage.setItem(LOCAL_STORAGE_ITEM_KEY.NETWORK_NAME, encryptData(league.networkName, deviceId));

    history.push('/about/league-dashboard');
  };

  // 点击加入联盟
  const onJoinLeague = async (league: LeagueSchema) => {
    const res = await dispatch({
      type: 'User/enrollInLeague',
      payload: {
        networkName: league.networkName,
        role: 'networkAssociateMember'
      }
    });
    if (res) {
      getLeagueList();
    }
  };

  // 分页
  const getMyLeagueListFromPage = useMemo(() => {
    return myCreatedNetworkList.slice((myLeaguePageNum - 1) * 7, myLeaguePageNum * 7);
  }, [myCreatedNetworkList, myLeaguePageNum]);
  // 分页
  const getJoinLeagueListFromPage = useMemo((): LeagueSchema[] => {
    return myJoinedNetworkList.slice((joinedLeaguePageNum - 1) * 8, joinedLeaguePageNum * 8);
  }, [myJoinedNetworkList, joinedLeaguePageNum]);
  // 分页
  const getOptionLeagueListFromPage = useMemo((): LeagueSchema[] => {
    return notJointedNetworkList.slice((optionLeaguePageNum - 1) * 8, optionLeaguePageNum * 8);
  }, [notJointedNetworkList, optionLeaguePageNum]);

  // 不同状态展示不同的内容
  const isAdminWithEmpty = useMemo(() => {
    return userInfo.role && AdminRole.includes(userInfo.role) && myCreatedNetworkList.length === 0;
  }, [myCreatedNetworkList.length, userInfo.role]);

  const isAdminNotEmpty = useMemo(() => {
    return userInfo.role && AdminRole.includes(userInfo.role) && myCreatedNetworkList.length > 0;
  }, [myCreatedNetworkList.length, userInfo.role]);

  return (
    <div className={styles.main}>
      <div className={styles['page-title-wrapper']}>我的联盟</div>
      {AdminRole.includes(userInfo.role) && clusterTotal === 0 && (
        <Alert
          message="暂无集群，请先创建"
          type="warning"
          action={
            <Button size="small" type="link" onClick={() => history.push('/common/cluster-management')}>
              去创建
            </Button>
          }
          style={{ marginBottom: '20px' }}
        />
      )}
      <Spin spinning={qryLoading}>
        {AdminRole.includes(userInfo.role) && (
          <div className="page-content page-content-shadow table-wrapper">
            <div className="table-header-title">我创建的联盟</div>
            <Divider />
            {isAdminWithEmpty && (
              <Empty description="暂无联盟">
                <Button type="primary" onClick={onClickCreate}>
                  立即创建
                </Button>
              </Empty>
            )}
            <Row gutter={16} className={styles['league-wrapper']}>
              {isAdminNotEmpty && (
                <Col span={6}>
                  <Button type="dashed" className={styles.newButton} onClick={onClickCreate}>
                    <PlusOutlined /> 新增联盟
                  </Button>
                </Col>
              )}
              {getMyLeagueListFromPage.map((league, i) => (
                <Col span={6} key={`${league.leagueName}_${i}`}>
                  <LeagueCard onClickCard={onClickLeague} leagueInfo={league} />
                </Col>
              ))}
            </Row>
            {myCreatedNetworkList.length > 7 && (
              <Pagination
                showSizeChanger={false}
                current={myLeaguePageNum}
                pageSize={7}
                total={myCreatedNetworkList.length}
                onChange={onMyLeaguePageChange}
                showTotal={(total) => `共 ${total} 条`}
                style={{ textAlign: 'center' }}
              />
            )}
          </div>
        )}
        <div className="page-content page-content-shadow table-wrapper">
          <div className="table-header-title">我加入的联盟</div>
          <Divider />
          {myJoinedNetworkList.length > 0 ? (
            <Row gutter={16} className={styles['league-wrapper']}>
              {getJoinLeagueListFromPage.map((league, i) => (
                <Col span={6} key={`${league.leagueName}_${i}`}>
                  <LeagueCard onClickCard={onClickLeague} leagueInfo={league} />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="暂未加入其他联盟" />
          )}
          {myJoinedNetworkList.length > 8 && (
            <Pagination
              showSizeChanger={false}
              current={joinedLeaguePageNum}
              pageSize={8}
              total={myJoinedNetworkList.length}
              onChange={onJoinedLeaguePageChange}
              showTotal={(total) => `共 ${total} 条`}
              style={{ textAlign: 'center' }}
            />
          )}
        </div>
        <div className="page-content page-content-shadow table-wrapper">
          <div className="table-header-title">
            <div>
              <span style={{ paddingRight: '4px' }}>可加入的联盟</span>
              <Tooltip title="点击联盟卡片，申请加入联盟">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
          </div>
          <Divider />
          {notJointedNetworkList.length > 0 ? (
            <Row gutter={16} className={styles['league-wrapper']}>
              {getOptionLeagueListFromPage.map((league, i) => (
                <Col span={6} key={`${league.leagueName}_${i}`}>
                  <LeagueCard onClickCard={onJoinLeague} leagueInfo={league} extra={true} />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="暂无联盟可加入" />
          )}
          {notJointedNetworkList.length > 8 && (
            <Pagination
              showSizeChanger={false}
              current={optionLeaguePageNum}
              pageSize={7}
              total={notJointedNetworkList.length}
              onChange={onOptionLeaguePageChange}
              showTotal={(total) => `共 ${total} 条`}
              style={{ textAlign: 'center' }}
            />
          )}
        </div>
      </Spin>
      {createVisible && <CreateLeague visible={createVisible} onCancel={onCancelCreate} />}
    </div>
  );
};

export default connect(({ User, Cluster, Layout, loading }: ConnectState) => ({
  User,
  Layout,
  Cluster,
  qryLoading: loading.effects['User/getNetworkList'] || loading.effects['User/getMyNetworkList']
}))(SelectLeague);
