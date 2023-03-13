import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Spin, Table, Space, Button, message, Modal, Descriptions, Statistic, Row, Col } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { BlockSchema, Dispatch, history, TransactionSchema } from 'umi';
import moment from 'moment';
import { Roles } from '~/utils/roles';
import { WelcomeBanner } from '~/components';
import { NetworkStatus, NetworkInfo, StopOrRestart, CanDeleteNetworkStatus } from '~/utils/networkStatus';
import CreateNetworkModal from './components/CreateNetworkModal';
import config from '~/utils/config';
import style from './index.less';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';
import { LOCAL_STORAGE_ITEM_KEY } from '~/utils/const';
import { StatisticValueStyle } from './_style';

export interface LeagueDashboardProps {
  Dashboard: ConnectState['Dashboard'];
  User: ConnectState['User'];
  Layout: ConnectState['Layout'];
  dispatch: Dispatch;
  qryBlockLoading: boolean;
  qryNetworkLoading: boolean;
  stopNetworkLoading: boolean;
  restartNetworkLoading: boolean;
  qryTransactionLoading: boolean;
  ElasticServer: ConnectState['ElasticServer'];
}
const LeagueDashboard: React.FC<LeagueDashboardProps> = (props) => {
  const {
    User,
    dispatch,
    Dashboard,
    qryBlockLoading,
    qryNetworkLoading = false,
    stopNetworkLoading = false,
    restartNetworkLoading = false,
    qryTransactionLoading
  } = props;
  const { leagueName, networkName, userRole } = User;
  const { serverTotal } = props.ElasticServer;
  const { networkStatusInfo, transactionList, blockList, channelTotal } = Dashboard;
  const [createVisible, setCreateVisible] = useState(false);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  const statisticsList = useMemo(() => {
    return [
      {
        label: `${userRole === Roles.MEMBER ? '已入联盟' : '成员'}`,
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
      type: `Dashboard/${userRole === Roles.MEMBER ? 'getStaticInfoForMember' : 'getStaticInfoForAdmin'}`,
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
        networkName,
        cmd: StopOrRestart.Restart
      }
    });
  }, [dispatch, networkName]);

  const onStopNetwork = useCallback(() => {
    const confirm = () => {
      dispatch({
        type: 'Dashboard/stopNetwork',
        payload: {
          networkName,
          cmd: StopOrRestart.Stop
        }
      });
    };
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `确认要停用网络 【${networkName}】 吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: confirm
    });
  }, [dispatch, networkName]);

  const onDeleteNetwork = useCallback(() => {
    const confirm = async () => {
      const res = dispatch({
        type: 'Dashboard/deleteNetwork',
        payload: {
          networkName
        }
      });
      if (res) {
        dispatch({
          type: 'Layout/common',
          payload: {
            globalLoading: true,
            loadingDescription: '删除网络请求提交成功, 网络将被删除, 即将退出联盟'
          }
        });
        setTimeout(() => {
          localStorage.removeItem(LOCAL_STORAGE_ITEM_KEY.ROLE_TOKEN);

          if (pollInterval) {
            clearInterval(pollInterval);
          }

          dispatch({
            type: 'User/cleanNetworkInfo',
            payload: {}
          });
          dispatch({
            type: 'Layout/common',
            payload: {
              globalLoading: false,
              loadingDescription: ''
            }
          });
          history.replace('/selectLeague');
        }, 4000);
      }
    };
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `确认要删除网络 【${networkName}】 吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: confirm
    });
  }, [dispatch, networkName, pollInterval]);

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
  const onClickBlockDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: BlockSchema) => {
    e.preventDefault();
    dispatch({
      type: 'Layout/setCurrentService',
      payload: {
        selectedMenu: '/about/block',
        currentService: '区块数据'
      }
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
  const onClickTransactionDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: TransactionSchema) => {
    e.preventDefault();
    dispatch({
      type: 'Layout/setCurrentService',
      payload: {
        selectedMenu: '/about/transactions',
        currentService: '交易信息'
      }
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
      width: userRole === Roles.MEMBER ? '17%' : '20%'
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
          <a href={`/about/block/${record.blockHash}`} onClick={(e) => onClickBlockDetail(e, record)}>
            详情
          </a>
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
      dataIndex: 'txMsp',
      key: 'txMsp',
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
          {record.channelId || record.txMsp ? (
            <a href={`/about/transactions/${record.txId}`} onClick={(e) => onClickTransactionDetail(e, record)}>
              详情
            </a>
          ) : (
            <a
              href={`/about/transactions/${record.txId}`}
              className="a-forbidden-style"
              onClick={(e) => e.preventDefault()}>
              详情
            </a>
          )}
        </Space>
      )
    }
  ];

  const btnShow: {
    createChannelLink: JSX.Element;
    deleteButton: JSX.Element;
    extraButton: JSX.Element;
  } = useMemo(() => {
    const btnShowInitValue = {
      createChannelLink: <></>,
      deleteButton: <></>,
      extraButton: <></>
    };
    if (userRole === Roles.ADMIN) {
      const status = networkStatusInfo?.networkStatus;
      switch (status) {
        case NetworkStatus.NotExist:
          btnShowInitValue.extraButton = (
            <Button type="primary" onClick={onCreateNetwork}>
              立即创建
            </Button>
          );
          break;
        case NetworkStatus.Stopped:
          btnShowInitValue.extraButton = (
            <Button type="primary" onClick={onRestartNetwork}>
              重启网络
            </Button>
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
              <Button type="primary" onClick={onStopNetwork}>
                停用网络
              </Button>
            );
          }
          break;
        default:
          break;
      }
      if (status && CanDeleteNetworkStatus.includes(status)) {
        btnShowInitValue.deleteButton = (
          <Button type="primary" danger onClick={onDeleteNetwork}>
            删除网络
          </Button>
        );
      }
    }
    return btnShowInitValue;
  }, [
    channelTotal,
    linkToCreateChannel,
    networkStatusInfo?.networkStatus,
    onCreateNetwork,
    onDeleteNetwork,
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
      if (networkStatusInfo?.networkStatus !== NetworkStatus.NotExist) {
        getBlockList();
        getStaticInfo();
        getTransactionList();
      }
      getNetworkInfo();
    }, 10000);
    setPollInterval(interval);
    return () => clearInterval(interval);
  }, [getBlockList, getNetworkInfo, getStaticInfo, getTransactionList, networkStatusInfo?.networkStatus]);

  useEffect(() => {
    dispatch({
      type: 'ElasticServer/getServerTotal',
      payload: {}
    });
    dispatch({
      type: 'Layout/setCurrentService',
      payload: {
        selectedMenu: '/about/league-dashboard',
        currentService: '联盟总览'
      }
    });
    localStorage.setItem(LOCAL_STORAGE_ITEM_KEY.NETWORK_PORTAL_SELECTED_MENU, '/about/league-dashboard');
  }, [dispatch]);

  return (
    <div className="page-wrapper">
      <div className="page-content">
        <WelcomeBanner
          title="Hi，欢迎使用区块链应用服务平台"
          subtitle="快速构建联盟链基础设施，提供区块链应用开发、部署、测试和监控的整套解决方案"
        />
        <Spin spinning={qryNetworkLoading || stopNetworkLoading || restartNetworkLoading}>
          <Descriptions title="基本信息" className={style['league-basic-info']}>
            <Descriptions.Item label="联盟名称">{leagueName}</Descriptions.Item>
            <Descriptions.Item label="网络名称">{networkName}</Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {networkStatusInfo ? moment(networkStatusInfo.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''}
            </Descriptions.Item>
            <Descriptions.Item label="网络状态">
              {networkStatusInfo ? NetworkInfo[networkStatusInfo.networkStatus] : ''}
              {btnShow.createChannelLink}
            </Descriptions.Item>
            <Descriptions.Item label="网络操作">
              <div>
                {btnShow.extraButton}
                {btnShow.deleteButton}
              </div>
            </Descriptions.Item>
          </Descriptions>
        </Spin>
        <div className={style['league-basic-info']}>
          <h2>链上数据</h2>
          <Row gutter={24} justify="space-between">
            {statisticsList.map((item) => (
              <Col key={item.label} span={4}>
                <Statistic title={item.label} value={item.num} valueStyle={StatisticValueStyle} />
              </Col>
            ))}
          </Row>
        </div>
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
  stopNetworkLoading: loading.effects['Dashboard/stopNetwork'],
  restartNetworkLoading: loading.effects['Dashboard/restartNetwork'],
  qryTransactionLoading: loading.effects['Dashboard/getTransactionList']
}))(LeagueDashboard);
