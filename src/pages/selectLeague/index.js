import React, { useState, useMemo } from 'react';
import { history, connect } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Row, Col, Button, Spin, Empty, Divider, Pagination } from 'antd';
import CreateLeague from './components/CreateLeague';
import { LeagueCard } from './components/LeagueCard';
import { Roles } from 'utils/roles.js';
import { getDifferenceSet } from 'utils';
import styles from './index.less';

function SelectLeague(props) {
  const { joinLoading = false, dispatch, User } = props;
  const { userInfo, networkList, myNetworkList } = User;
  const [visible, setVisible] = useState(false);
  const [myLeaguePageNum, setMyLeaguePageNum] = useState(1);
  const [optionLeaguePageNum, setOptionLeaguePageNum] = useState(1);

  // 分页
  const getMyLeagueListFromPage = useMemo(() => {
    return myNetworkList.slice((myLeaguePageNum - 1) * 7, myLeaguePageNum * 7);
  }, [myNetworkList, myLeaguePageNum]);

  const onMyLeaguePageChange = (page) => {
    setMyLeaguePageNum(page);
  };

  const getOptionalNetwork = useMemo(() => {
    return getDifferenceSet(networkList, myNetworkList, 'networkName');
  }, [networkList, myNetworkList]);

  // 分页
  const getOptionLeagueListFromPage = useMemo(() => {
    return getOptionalNetwork.slice((optionLeaguePageNum - 1) * 8, optionLeaguePageNum * 8);
  }, [getOptionalNetwork, optionLeaguePageNum]);

  const onOptionLeaguePageChange = (page) => {
    setOptionLeaguePageNum(page);
  };

  const onCancel = (label) => {
    setVisible(false);
    if (label) {
      dispatch({
        type: 'User/getMyNetworkList',
        payload: {},
      });
    }
  };

  const onClickNew = () => {
    setVisible(true);
  };

  // 点击加入联盟
  const onJoinLeague = async (league) => {
    const res = await dispatch({
      type: 'User/enrollInLeague',
      payload: {
        networkName: league.networkName,
        role: 'networkAssociateMember',
      },
    });
    if (res) {
      await dispatch({
        type: 'User/getNetworkList',
        payload: {},
      });
      await dispatch({
        type: 'User/getMyNetworkList',
        payload: {},
      });
    }
  };

  // 点击联盟进入系统
  const onClickLeague = (league) => {
    dispatch({
      type: 'User/enterLeague',
      payload: {
        role: league.role,
        email: userInfo.contactEmail,
        networkName: league.networkName,
      },
    }).then((res) => {
      if (res) {
        dispatch({
          type: 'User/common',
          payload: {
            userRole: league.role,
            networkName: league.networkName,
            leagueName: league.leagueName,
          },
        });
        dispatch({
          type: 'Layout/common',
          payload: { selectedMenu: '/about/league-dashboard' },
        });
        localStorage.setItem('userRole', league.role);
        localStorage.setItem('leagueName', league.leagueName);
        localStorage.setItem('networkName', league.networkName);
        history.replace('/about/league-dashboard');
      }
    });
  };

  // 不同状态展示不同的内容
  const isAdminWithEmpty = userInfo.role && userInfo.role === Roles.Admin && myNetworkList.length === 0;
  const isAdminNotEmpty = userInfo.role && userInfo.role === Roles.Admin && myNetworkList.length > 0;
  const notAdminWithEmpty = (!userInfo.role || userInfo.role !== Roles.Admin) && myNetworkList.length === 0;
  return (
    <div className={styles.main}>
      <div>
        <h3>加入联盟</h3>
        <Spin spinning={joinLoading}>
          <Row gutter={16} className={styles['league-wrapper']}>
            {getOptionLeagueListFromPage.map((league, i) => (
              <Col span={6} key={`${league.leagueName}_${i}`}>
                <LeagueCard showTime="Create Time" onClickCard={onJoinLeague} leagueInfo={league} />
              </Col>
            ))}
          </Row>
          {getOptionalNetwork.length === 0 && <Empty description="暂无联盟可加入" />}
          {getOptionalNetwork.length > 8 && (
            <Pagination
              showSizeChanger={false}
              pageNum={optionLeaguePageNum}
              pageSize={8}
              total={getOptionalNetwork.length}
              onChange={onOptionLeaguePageChange}
              showTotal={(total) => `共 ${total} 条`}
              style={{ textAlign: 'center' }}
            />
          )}
        </Spin>
      </div>
      <Divider />
      <div>
        <h3>我的联盟</h3>
        {isAdminWithEmpty && (
          <Empty description="暂无联盟">
            <Button type="primary" onClick={onClickNew}>
              立即创建
            </Button>
          </Empty>
        )}
        {notAdminWithEmpty && <Empty description="暂无联盟" />}
        <Row gutter={16} className={styles['league-wrapper']}>
          {isAdminNotEmpty && (
            <Col span={6}>
              <Button type="dashed" className={styles.newButton} onClick={onClickNew}>
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
        {myNetworkList.length > 7 && (
          <Pagination
            showSizeChanger={false}
            pageNum={myLeaguePageNum}
            pageSize={7}
            total={myNetworkList.length}
            onChange={onMyLeaguePageChange}
            showTotal={(total) => `共 ${total} 条`}
            style={{ textAlign: 'center' }}
          />
        )}
      </div>
      {visible && <CreateLeague visible={visible} onCancel={onCancel} />}
    </div>
  );
}

export default connect(({ User, Layout, loading }) => ({
  User,
  Layout,
  joinLoading: loading.effects['User/enrollInLeague'],
}))(SelectLeague);
