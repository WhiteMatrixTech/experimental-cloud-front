import React, { useState, useEffect } from 'react';
import { Spin, Table, Space, Col, Row, Button } from 'antd';
import { connect } from 'dva';
import { history } from 'umi';
import moment from 'moment';
import { Roles } from 'utils/roles';
import { StatisticsCard, Breadcrumb } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu';
import { NetworkStatus, NetworkInfo } from 'utils/networkStatus';
import CreateNetwork from './components/CreateNetwork';
import style from './index.less';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/leagueDashboard');
const statisticsList = [
  { label: '成员', num: '17' },
  { label: '通道', num: '2' },
  { label: '合约', num: '7' },
  { label: '区块', num: '484' },
  { label: '交易', num: '527' },
];

function LeagueDashboard(props) {
  const { Dashboard, dispatch, qryBlockLoading, qryNetworkLoading = false, qryTransactionLoading, User } = props;
  const { leagueName, networkName, userRole } = User;
  const [blockColumns, setBlockColumns] = useState([]);
  const [transactionColumns, setTransactionColumns] = useState([]);
  const { networkStatusInfo, transactionList, blockList } = Dashboard;
  const [barType, setBarType] = useState('seven');
  const [createVisible, setCreateVisible] = useState(false);

  const onChangeBarType = (e) => {
    setBarType({ barType: e.target.value });
  };

  // 获取网络信息
  const getNetworkInfo = () => {
    dispatch({
      type: 'Dashboard/getNetworkInfo',
      payload: {
        networkName: networkName
      },
    });
  }

  // 取消创建网络
  const onClickCancel = res => {
    setCreateVisible(false);
    if (res) {
      getNetworkInfo();
    }
  }

  // 点击创建网络
  const onCreateNetwork = () => {
    setCreateVisible(true)
  }

  // 获取区块列表
  const getBlockList = () => {
    const offset = (pageNum - 1) * 6;
    const params = {
      networkName,
      offset: offset,
      limit: 6,
      ascend: false,
    };
    dispatch({
      type: 'Dashboard/getBlockList',
      payload: params,
    });
  };

  // 查看区块详情
  const onClickBlockDetail = (record) => {
    history.push({
      pathname: `/about/block/${record.blockHash}`,
      query: {
        blockHash: record.blockHash,
      },
    });
  };

  // 获取交易列表
  const getTransactionList = () => {
    const offset = (pageNum - 1) * 6;
    const params = {
      networkName,
      offset: offset,
      limit: 6,
      ascend: false,
    };
    dispatch({
      type: 'Dashboard/getTransactionList',
      payload: params,
    });
  };

  // 查看交易详情
  const onClickTransactionDetail = (record) => {
    history.push({
      pathname: `/about/channel/${record.txId}`,
      query: {
        channelId: record.txId,
      },
    });
  };

  //用户身份改变时，表格展示改变
  useEffect(() => {
    const block = [
      {
        title: '区块HASH',
        dataIndex: 'blockHash',
        key: 'blockHash',
        ellipsis: true,
        width: userRole === Roles.NetworkMember ? '17%' : '20%',
      },
      {
        title: '所属通道',
        dataIndex: 'channelName',
        key: 'channelName',
      },
      {
        title: '交易数量',
        dataIndex: 'txCount',
        key: 'txCount',
      },
      {
        title: '生成时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="small">
            <a onClick={() => onClickBlockDetail(record)}>详情</a>
          </Space>
        ),
      },
    ];
    const transaction = [
      {
        title: '交易ID',
        dataIndex: 'txId',
        key: 'txId',
        ellipsis: true,
        width: '17%',
      },
      {
        title: '所属通道',
        dataIndex: 'channelName',
        key: 'channelName',
      },
      {
        title: '交易组织',
        dataIndex: 'txEndorseMsp',
        key: 'txEndorseMsp',
      },
      {
        title: '合约名称',
        dataIndex: 'chainCodeName',
        key: 'chainCodeName',
      },
      {
        title: '生成时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="small">
            <a onClick={() => onClickTransactionDetail(record)}>详情</a>
          </Space>
        ),
      },
    ];
    if (userRole === Roles.NetworkMember) {
      const insertColumn = {
        title: '所属联盟',
        dataIndex: 'leagueName',
        key: 'leagueName',
      };
      block.splice(1, 0, insertColumn);
      transaction.splice(1, 0, insertColumn);
    }
    setBlockColumns(block);
    setTransactionColumns(transaction);
  }, [userRole]);

  useEffect(() => {
    getBlockList();
    getTransactionList();
    getNetworkInfo();
    // 轮询网络状态
    const interval = setInterval(() => getNetworkInfo(), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryNetworkLoading}>
          <div className={style['league-basic-info']}>
            <Row>
              <Col span={8}>
                <label>联盟名称：</label>
                <span>{leagueName}</span>
              </Col>
              <Col span={8}>
                <label>创建时间：</label>
                <span>{networkStatusInfo.createdAt}</span>
              </Col>
              <Col span={8}>
                <label>网络状态: </label>
                <span>{NetworkInfo[networkStatusInfo.networkStatus]}</span>
                {(networkStatusInfo.networkStatus === NetworkStatus.Errored) && (
                  <span>,请联系技术人员排查</span>
                )}
              </Col>
              {(userRole === Roles.NetworkAdmin) && (networkStatusInfo.networkStatus === NetworkStatus.NotExist) && (
                <Col span={8}>
                  <Button type="primary" onClick={onCreateNetwork}>立即创建</Button>
                </Col>
              )}
            </Row>
          </div>
        </Spin>
        <StatisticsCard statisticsList={statisticsList} />
        {/* {userRole === Roles.NetworkAdmin && (
          <div id="leagua-scatter" className={style['leagua-scatter-wrapper']}>
            <div className={style['league-scatter-title']}>联盟图</div>
            <LeagueScatter />
          </div>
        )}
        <div className={`${style['leagua-bar-wrapper']} page-content-shadow`}>
          <div className={style['leagua-bar-header']}>
            <div className={style.title}>交易时间表</div>
            <Radio.Group value={barType} onChange={onChangeBarType}>
              <Radio.Button value="seven">7天</Radio.Button>
              <Radio.Button value="thirty">30天</Radio.Button>
            </Radio.Group>
          </div>
          <LeagueBar type={barType} />
        </div> */}
        <Table
          rowKey="_id"
          columns={blockColumns}
          loading={qryBlockLoading}
          dataSource={blockList}
          className="page-content-shadow"
          pagination={false}
        />
        <Table
          rowKey="_id"
          columns={transactionColumns}
          loading={qryTransactionLoading}
          dataSource={transactionList}
          className="page-content-shadow"
          pagination={false}
        />
      </div>
      {createVisible && <CreateNetwork visible={createVisible} onCancel={onClickCancel} />}
    </div>
  );
}

export default connect(({ User, Layout, Dashboard, loading }) => ({
  User,
  Layout,
  Dashboard,
  deleteLoading: loading.effects['Dashboard/deleteNetwork'],
  qryBlockLoading: loading.effects['Dashboard/getBlockList'],
  qryNetworkLoading: loading.effects['Dashboard/getNetworkInfo'],
  qryTransactionLoading: loading.effects['Dashboard/getTransactionList'],
}))(LeagueDashboard);
