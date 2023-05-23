import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Spin, Table, Space, Button, message, Modal, Descriptions, Statistic, Row, Col } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { BlockSchema, Dispatch, history, TransactionSchema } from 'umi';
import moment from 'moment';
import { Roles } from '~/utils/roles';
import { WelcomeBanner } from '~/components';
import { NetworkStatus, NetworkInfo, StopOrRestart, CanDeleteNetworkStatus } from '~/utils/networkStatus';
import CreateNetwork from './components/CreateNetwork';
import config from '~/utils/config';
import style from './index.less';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';
import { LOCAL_STORAGE_ITEM_KEY } from '~/utils/const';
import { StatisticValueStyle } from './_style';
import { useRafInterval } from 'ahooks';
import { formatDate, renderDateWithDefault } from '~/utils/date';
import ConfigCA from './components/ConfigCA/index';

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
  Cluster: ConnectState['Cluster'];
}
const LeagueDashboard: React.FC<LeagueDashboardProps> = (props) => {
  const {
    User,
    Cluster,
    dispatch,
    Dashboard,
    qryBlockLoading,
    qryNetworkLoading = false,
    stopNetworkLoading = false,
    restartNetworkLoading = false,
    qryTransactionLoading
  } = props;
  const { clusterTotal } = Cluster;
  const { leagueName, networkName, userRole } = User;
  const { networkStatusInfo, transactionList, blockList, channelTotal } = Dashboard;
  const [createVisible, setCreateVisible] = useState(false);
  const [configCAVisible, setConfigCAVisible] = useState(false);

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
    dispatch({
      type: `Dashboard/${userRole === Roles.MEMBER ? 'getStaticInfoForMember' : 'getStaticInfoForAdmin'}`,
      payload: { networkName }
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

  // todo query
  const clearInterval = useRafInterval(
    () => {
      if (networkStatusInfo?.status !== NetworkStatus.NotExist) {
        getBlockList();
        getStaticInfo();
        getTransactionList();
      }
      getNetworkInfo();
    },
    10000,
    { immediate: true }
  );

  // 取消创建网络
  const onClickCancel = (res: any) => {
    setCreateVisible(false);
    if (res) {
      getNetworkInfo();
    }
  };

  // 点击创建网络
  const onCreateNetwork = useCallback(() => {
    if (clusterTotal === 0) {
      message.warn('请先在【集群管理中创建集群】');
      return;
    }
    setCreateVisible(true);
  }, [clusterTotal]);

  const onConfigCAExpireTime = useCallback(() => {
    setConfigCAVisible(true);
  }, []);
  const onCancelCA = () => {
    setConfigCAVisible(false);
  };

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

          clearInterval();

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
  }, [clearInterval, dispatch, networkName]);

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
      pathname: `/about/transactions/${record.txHash}`,
      query: {
        channelId: record.txHash
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
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: renderDateWithDefault
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
      title: '交易哈希',
      dataIndex: 'txHash',
      key: 'txHash',
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
      render: (text) => (text ? formatDate(text) : <span className="a-forbidden-style">信息访问受限</span>)
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record: TransactionSchema) => (
        <Space size="small">
          {record.channelId || record.txMsp ? (
            <a href={`/about/transactions/${record.txHash}`} onClick={(e) => onClickTransactionDetail(e, record)}>
              详情
            </a>
          ) : (
            <a
              href={`/about/transactions/${record.txHash}`}
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
      const status = networkStatusInfo?.status;
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
            <>
              <Button type="primary" onClick={onRestartNetwork}>
                重启网络
              </Button>
              <Button type="ghost" onClick={onConfigCAExpireTime}>
                配置CA过期时间
              </Button>
            </>
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
              <>
                <Button type="primary" onClick={onStopNetwork}>
                  停用网络
                </Button>
                <Button type="ghost" onClick={onConfigCAExpireTime}>
                  配置CA过期时间
                </Button>
              </>
            );
          }
          break;
        default:
          break;
      }
      if (status && CanDeleteNetworkStatus.includes(status)) {
        btnShowInitValue.deleteButton = (
          <>
            <Button type="primary" danger onClick={onDeleteNetwork}>
              删除网络
            </Button>
          </>
        );
      }
    }
    return btnShowInitValue;
  }, [
    channelTotal,
    linkToCreateChannel,
    networkStatusInfo?.status,
    onConfigCAExpireTime,
    onCreateNetwork,
    onDeleteNetwork,
    onRestartNetwork,
    onStopNetwork,
    userRole
  ]);

  useEffect(() => {
    dispatch({
      type: 'Cluster/getClusterList',
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
    return () => {
      clearInterval();
    };
  }, [clearInterval, dispatch]);

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
              {renderDateWithDefault(networkStatusInfo?.createTime)}
            </Descriptions.Item>
            <Descriptions.Item label="网络状态">
              {networkStatusInfo?.status ? NetworkInfo[networkStatusInfo.status] : '--'}
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
            rowKey="txHash"
            columns={transactionColumns}
            loading={qryTransactionLoading}
            dataSource={transactionList}
            pagination={false}
          />
        </div>
      </div>
      {createVisible && <CreateNetwork visible={createVisible} onCancel={onClickCancel} />}
      {configCAVisible && <ConfigCA visible={configCAVisible} onCancel={onCancelCA} />}
    </div>
  );
};

export default connect(({ Layout, Dashboard, Cluster, User, loading }: ConnectState) => ({
  User,
  Layout,
  Cluster,
  Dashboard,
  qryBlockLoading: loading.effects['Dashboard/getBlockList'],
  qryNetworkLoading: loading.effects['Dashboard/getNetworkInfo'],
  stopNetworkLoading: loading.effects['Dashboard/stopNetwork'],
  restartNetworkLoading: loading.effects['Dashboard/restartNetwork'],
  qryTransactionLoading: loading.effects['Dashboard/getTransactionList']
}))(LeagueDashboard);
