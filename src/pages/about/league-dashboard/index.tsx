import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Spin, Table, Space, Col, Row, Button, message } from 'antd';
import { connect } from 'dva';
import { BlockSchema, Dispatch, history, TransactionSchema } from 'umi';
import moment from 'moment';
import { Roles } from '~/utils/roles';
import { StatisticsCard, Breadcrumb } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { NetworkStatus, NetworkInfo } from '~/utils/networkStatus';
import CreateNetworkModal from './components/CreateNetworkModal';
import config from '~/utils/config';
import style from './index.less';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/league-dashboard');
export interface LeagueDashboardProps {
  Dashboard: ConnectState['Dashboard'];
  User: ConnectState['User'];
  dispatch: Dispatch;
  qryBlockLoading: boolean;
  qryNetworkLoading: boolean;
  qryTransactionLoading: boolean;
  ElasticServer: ConnectState['ElasticServer'];
}
const LeagueDashboard: React.FC<LeagueDashboardProps> = (props) => {
  const { Dashboard, User, dispatch, qryBlockLoading, qryNetworkLoading = false, qryTransactionLoading } = props;
  const { leagueName, networkName, userRole } = User;
  const { serverTotal } = props.ElasticServer;
  const { networkStatusInfo, transactionList, blockList, channelTotal } = Dashboard;
  const [createVisible, setCreateVisible] = useState(false);

  const statisticsList = useMemo(() => {
    return [
      {
        label: `${userRole === Roles.NetworkMember ? '已入联盟' : '成员'}`,
        num: Dashboard.memberTotal
      },
      { label: '通道', num: Dashboard.channelTotal },
      { label: '合约', num: Dashboard.myContractTotal },
      { label: '区块', num: Dashboard.blockTotal },
      { label: '交易', num: Dashboard.transactionTotal }
    ];
  }, [
    Dashboard.blockTotal,
    Dashboard.channelTotal,
    Dashboard.memberTotal,
    Dashboard.myContractTotal,
    Dashboard.transactionTotal,
    userRole
  ]);

  // 获取统计信息
  const getStaticInfo = useCallback(() => {
    const params = {
      networkName
    };
    dispatch({
      type: `Dashboard/${userRole === Roles.NetworkMember ? 'getStaticInfoForMember' : 'getStaticInfoForAdmin'}`,
      payload: params
    });
    dispatch({
      type: 'ElasticServer/getServerList',
      payload: {
        limit: 100,
        offset: 0,
        ascend: false
      }
    });
  }, [dispatch, networkName, userRole]);

  // 获取网络信息
  const getNetworkInfo = useCallback(() => {
    dispatch({
      type: 'Dashboard/getNetworkInfo',
      payload: {
        networkName: networkName
      }
    });
  }, [dispatch, networkName]);

  // 取消创建网络
  const onClickCancel = (res: any) => {
    setCreateVisible(false);
    if (res) {
      getNetworkInfo();
    }
  };

  // 点击创建网络
  const onCreateNetwork = useCallback(() => {
    if (serverTotal === 0) {
      message.warn('请先在【弹性云服务器管理中创建服务器】');
      return;
    }
    setCreateVisible(true);
  }, [serverTotal]);

  const onRestartNetwork = useCallback(() => {
    dispatch({
      type: 'Dashboard/restartNetwork',
      payload: {
        networkName: networkName
      }
    });
  }, [dispatch, networkName]);

  const onStopNetwork = useCallback(() => {
    dispatch({
      type: 'Dashboard/stopNetwork',
      payload: {
        networkName: networkName
      }
    });
  }, [dispatch, networkName]);

  // 点击去创建通道
  const linkToCreateChannel = useCallback(
    (e: any) => {
      e.preventDefault();
      dispatch({
        type: 'Layout/common',
        payload: { selectedMenu: '/about/channels' }
      });
      history.push({
        pathname: '/about/channels',
        state: { openModal: true }
      });
    },
    [dispatch]
  );

  // 获取区块列表
  const getBlockList = useCallback(() => {
    const offset = 0;
    const params = {
      networkName,
      offset: offset,
      limit: config.pageSize,
      ascend: false
    };
    dispatch({
      type: 'Dashboard/getBlockList',
      payload: params
    });
  }, [dispatch, networkName]);

  // 查看区块详情
  const onClickBlockDetail = (record: BlockSchema) => {
    dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: '/about/block' }
    });
    history.push({
      pathname: `/about/block/${record.blockHash}`,
      query: {
        blockHash: record.blockHash
      }
    });
  };

  // 获取交易列表
  const getTransactionList = useCallback(() => {
    const offset = 0;
    const params = {
      networkName,
      offset: offset,
      limit: config.pageSize,
      ascend: false
    };
    dispatch({
      type: 'Dashboard/getTransactionList',
      payload: params
    });
  }, [dispatch, networkName]);

  // 查看交易详情
  const onClickTransactionDetail = (record: TransactionSchema) => {
    dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: '/about/transactions' }
    });
    history.push({
      pathname: `/about/transactions/${record.txId}`,
      query: {
        channelId: record.txId
      }
    });
  };

  const blockColumns: ColumnsType<any> = [
    {
      title: '区块HASH',
      dataIndex: 'blockHash',
      key: 'blockHash',
      ellipsis: true,
      width: userRole === Roles.NetworkMember ? '17%' : '20%'
    },
    {
      title: '所属通道',
      dataIndex: 'channelId',
      key: 'channelId'
    },
    {
      title: '交易数量',
      dataIndex: 'txCount',
      key: 'txCount'
    },
    {
      title: '生成时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record: BlockSchema) => (
        <Space size="small">
          <a onClick={() => onClickBlockDetail(record)}>详情</a>
        </Space>
      )
    }
  ];
  const transactionColumns: ColumnsType<any> = [
    {
      title: '交易ID',
      dataIndex: 'txId',
      key: 'txId',
      ellipsis: true,
      width: '17%'
    },
    {
      title: '所属通道',
      dataIndex: 'channelId',
      key: 'channelId',
      render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>
    },
    {
      title: '交易组织',
      dataIndex: 'txEndorseMsp',
      key: 'txEndorseMsp',
      render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>
    },
    {
      title: '合约名称',
      dataIndex: 'chainCodeName',
      key: 'chainCodeName',
      render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>
    },
    {
      title: '生成时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : <span className="a-forbidden-style">信息访问受限</span>
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record: TransactionSchema) => (
        <Space size="small">
          {record.channelId || record.txEndorseMsp ? (
            <a onClick={() => onClickTransactionDetail(record)}>详情</a>
          ) : (
            <a className="a-forbidden-style">详情</a>
          )}
        </Space>
      )
    }
  ];

  const btnShow: {
    createChannelLink: JSX.Element;
    extraButton: JSX.Element;
  } = useMemo(() => {
    const btnShowInitValue = {
      createChannelLink: <></>,
      extraButton: <></>
    };
    if (userRole === Roles.NetworkAdmin) {
      switch (networkStatusInfo?.networkStatus) {
        case NetworkStatus.NotExist:
          btnShowInitValue.extraButton = (
            <Col span={8}>
              <Button type="primary" onClick={onCreateNetwork}>
                立即创建
              </Button>
            </Col>
          );
          break;
        case NetworkStatus.Stopped:
          btnShowInitValue.extraButton = (
            <Col span={8}>
              <Button type="primary" onClick={onRestartNetwork}>
                重启网络
              </Button>
            </Col>
          );
          break;
        case NetworkStatus.Running:
          if (channelTotal === 0) {
            btnShowInitValue.createChannelLink = (
              <>
                <span className={style.description}>，网络中暂无通道，</span>
                <a href="/about/channels" onClick={linkToCreateChannel}>
                  去创建
                </a>
              </>
            );
          } else {
            btnShowInitValue.extraButton = (
              <Col span={8}>
                <Button type="primary" onClick={onStopNetwork}>
                  停用网络
                </Button>
              </Col>
            );
          }
          break;
        default:
          break;
      }
    }
    return btnShowInitValue;
  }, [
    channelTotal,
    linkToCreateChannel,
    networkStatusInfo?.networkStatus,
    onCreateNetwork,
    onRestartNetwork,
    onStopNetwork,
    userRole
  ]);

  useEffect(() => {
    getBlockList();
    getNetworkInfo();
    getStaticInfo();
    getTransactionList();
    // 轮询
    const interval = setInterval(() => {
      getBlockList();
      getNetworkInfo();
      getStaticInfo();
      getTransactionList();
    }, 10000);
    return () => clearInterval(interval);
  }, [getBlockList, getNetworkInfo, getStaticInfo, getTransactionList]);

  useEffect(() => {
    dispatch({
      type: 'ElasticServer/getServerTotal',
      payload: {}
    });
  }, [dispatch]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryNetworkLoading}>
          <div className={style['league-basic-info']}>
            <Row>
              <Col span={8}>
                <label>联盟名称：</label>
                <span className={style.description}>{leagueName}</span>
              </Col>
              <Col span={8}>
                <label>创建时间：</label>
                <span className={style.description}>
                  {networkStatusInfo ? moment(networkStatusInfo.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''}
                </span>
              </Col>
              <Col span={8}>
                <label>网络状态: </label>
                <span className={style.description}>
                  {networkStatusInfo ? NetworkInfo[networkStatusInfo.networkStatus] : ''}
                </span>
                {btnShow.createChannelLink}
              </Col>
              {btnShow.extraButton}
            </Row>
          </div>
        </Spin>
        <StatisticsCard statisticsList={statisticsList} />
        <div className="page-content page-content-shadow table-wrapper">
          <Table
            rowKey="blockHash"
            columns={blockColumns}
            loading={qryBlockLoading}
            dataSource={blockList}
            pagination={false}
          />
        </div>
        <div className="page-content page-content-shadow table-wrapper">
          <Table
            rowKey="txId"
            columns={transactionColumns}
            loading={qryTransactionLoading}
            dataSource={transactionList}
            pagination={false}
          />
        </div>
      </div>
      {createVisible && <CreateNetworkModal visible={createVisible} onCancel={onClickCancel} />}
    </div>
  );
};

export default connect(({ Layout, Dashboard, ElasticServer, User, loading }: ConnectState) => ({
  User,
  Layout,
  Dashboard,
  ElasticServer,
  qryBlockLoading: loading.effects['Dashboard/getBlockList'],
  qryNetworkLoading: loading.effects['Dashboard/getNetworkInfo'],
  qryTransactionLoading: loading.effects['Dashboard/getTransactionList']
}))(LeagueDashboard);
