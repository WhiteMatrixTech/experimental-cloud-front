import React, { useState, useEffect } from 'react';
import { history, connect } from 'umi';
import { PlusOutlined, RocketTwoTone } from '@ant-design/icons';
import { Row, Col, Button, Spin, Empty, Divider } from 'antd';
import CreateLeague from './components/CreateLeague';
import { Roles } from 'utils/roles.js';
import { getDifferenceSet } from 'utils';
import moment from 'moment';
import styles from './index.less';

function SelectLeague(props) {
  const { joinLoading = false, dispatch, User } = props;
  const { userInfo, networkList, myNetworkList } = User;
  const [visible, setVisible] = useState(false);

  const onCancel = () => {
    setVisible(false);
  }

  const onClickNew = () => {
    setVisible(true);
  }

  const getOptionalNetwork = () => {
    return getDifferenceSet(networkList, myNetworkList, 'networkName')
  }

  // 点击加入网络
  const onJoinLeague = async (league) => {
    await dispatch({
      type: 'User/joinNetwork',
      payload: {
        networkName: league.networkName,
        role: 'networkMember'
      }
    })
    const res = await dispatch({
      type: 'User/enterNetwork',
      payload: {
        contactEmail: userInfo.contactEmail,
        networkName: league.networkName,
      }
    })
    if (res) {
      history.replace('/about/leagueDashboard');
    }
  }

  // 点击网络进入系统
  const onClickLeague = league => {
    dispatch({
      type: 'User/enterNetwork',
      payload: {
        contactEmail: userInfo.contactEmail,
        networkName: league.networkName,
      }
    }).then(res => {
      if (res) {
        dispatch({
          type: 'User/common',
          payload: {
            userRole: league.role,
            networkName: league.networkName,
          }
        });
        localStorage.setItem('userRole', league.role);
        localStorage.setItem('networkName', league.networkName);
        history.replace('/about/leagueDashboard');
      }
    })
  }

  // 不同状态展示不同的内容
  const isAdminWithEmpty = userInfo.role && (userInfo.role === Roles.Admin) && (myNetworkList.length === 0);
  const isAdminNotEmpty = userInfo.role && (userInfo.role === Roles.Admin) && (myNetworkList.length > 0);
  const notAdminWithEmpty = (!userInfo.role || userInfo.role !== Roles.Admin) && (myNetworkList.length === 0);
  return (
    <div className={styles.main}>
      <Spin spinning={joinLoading}>
        <div>
          <h3>加入联盟</h3>
          <Row gutter={16} className={styles['league-wrapper']}>
            {getOptionalNetwork().map((league, i) => (
              <Col span={6} key={`${league.networkName}_${i}`}>
                <div className={styles['league-card']} onClick={() => onJoinLeague(league)}>
                  <div className={styles['card-header']}>
                    <span className={styles.icon}><RocketTwoTone /></span>
                    <span className={styles['league-name']}>{league.networkName}</span>
                  </div>
                  <div className={styles['card-content']}>{league.desc}</div>
                  <div className={styles['card-footer']}>
                    <div className={styles.allies}>Create Time</div>
                    <div className={styles.createTime}>{league.createAt ? moment(league.createAt).format('YYYY-MM-DD HH:mm:ss') : ''}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          {networkList.length === 0 && <Empty description='暂无联盟可加入' />}
        </div>
        <Divider />
        <div>
          <h3>我的联盟</h3>
          {isAdminWithEmpty && <Empty description='暂无联盟' >
            <Button type="primary" onClick={onClickNew}>立即创建</Button>
          </Empty>
          }
          {notAdminWithEmpty && <Empty description='暂无联盟' />}
          <Row gutter={16} className={styles['league-wrapper']}>
            {isAdminNotEmpty && <Col span={6}>
              <Button type="dashed" className={styles.newButton} onClick={onClickNew}>
                <PlusOutlined /> 新增联盟
            </Button>
            </Col>}
            {myNetworkList.map((league, i) => (
              <Col span={6} key={`${league.networkName}_${i}`}>
                <div className={styles['league-card']} onClick={() => onClickLeague(league)}>
                  <div className={styles['card-header']}>
                    <span className={styles.icon}><RocketTwoTone /></span>
                    <span className={styles['league-name']}>{league.networkName}</span>
                  </div>
                  <div className={styles['card-content']}>{league.desc}</div>
                  <div className={styles['card-footer']}>
                    <div className={styles.allies}>Join Time</div>
                    <div className={styles.createTime}>{league.timeAdded ? moment(league.timeAdded).format('YYYY-MM-DD HH:mm:ss') : ''}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Spin>
      {visible && <CreateLeague visible={visible} onCancel={onCancel} />}
    </div>
  );
};

export default connect(({ User, loading }) => ({
  User,
  joinLoading: loading.effects['User/joinNetwork']
}))(SelectLeague);
