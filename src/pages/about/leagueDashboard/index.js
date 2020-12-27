import React, { useState, useEffect } from 'react';
import { Radio, Table, Space, Col, Row } from 'antd';
import { connect } from 'dva';
import { history } from 'umi';
import moment from 'moment';
import { Roles } from 'utils/roles.js';
import { StatisticsCard, LeagueBar, LeagueScatter, Breadcrumb } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
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
  const { Dashboard, dispatch, qryBlockLoading, qryTransactionLoading, User } = props;
  const { networkName, userRole } = User;
  const [blockColumns, setBlockColumns] = useState([]);
  const [transactionColumns, setTransactionColumns] = useState([]);
  const { transactionList, blockList } = Dashboard;
  const [barType, setBarType] = useState('seven');

  const onChangeBarType = (e) => {
    setBarType({ barType: e.target.value });
  };
  // 获取区块列表
  const getBlockList = () => {
    const params = {
      networkName,
      blockHash: '',
      limit: 6,
      paginator: 0,
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
    const params = {
      networkName,
      companyId: 1,
      limit: 6,
      paginator: 0,
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
  }, []);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <div className={style['league-basic-info']}>
          <Row>
            <Col span={8}>
              <label>联盟名称：</label>
              <span>{'数研院'}</span>
            </Col>
            <Col span={8}>
              <label>创建时间：</label>
              <span>{'2020-07-03 17:56:23'}</span>
            </Col>
          </Row>
        </div>
        <StatisticsCard statisticsList={statisticsList} />
        {userRole === Roles.NetworkAdmin && (
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
        </div>
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
    </div>
  );
}

export default connect(({ User, Layout, Dashboard, loading }) => ({
  User,
  Layout,
  Dashboard,
  qryBlockLoading: loading.effects['Dashboard/getBlockList'],
  qryTransactionLoading: loading.effects['Dashboard/getTransactionList'],
}))(LeagueDashboard);
