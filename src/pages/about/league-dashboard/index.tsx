import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Spin, Table, Space, Col, Row, Button, message, Modal, notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { BlockSchema, Dispatch, history, TransactionSchema } from 'umi';
import moment from 'moment';
import { Roles } from '~/utils/roles';
import { StatisticsCard, Breadcrumb } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { NetworkStatus, NetworkInfo, StopOrRestart, CanDeleteNetworkStatus } from '~/utils/networkStatus';
import CreateNetworkModal from './components/CreateNetworkModal';
import config from '~/utils/config';
import style from './index.less';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';
import { LOCAL_STORAGE_ITEM_KEY } from '~/utils/const';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/league-dashboard');
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
        label: `${userRole === Roles.NetworkMember ? '????????????' : '??????'}`,
        num: Dashboard.memberTotal
      },
      { label: '??????', num: Dashboard.channelTotal },
      { label: '??????', num: Dashboard.myContractTotal },
      { label: '??????', num: Dashboard.blockTotal },
      { label: '??????', num: Dashboard.transactionTotal }
    ];
  }, [
    Dashboard.blockTotal,
    Dashboard.channelTotal,
    Dashboard.memberTotal,
    Dashboard.myContractTotal,
    Dashboard.transactionTotal,
    userRole
  ]);

  // ??????????????????
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

  // ??????????????????
  const getNetworkInfo = useCallback(() => {
    dispatch({
      type: 'Dashboard/getNetworkInfo',
      payload: {
        networkName: networkName
      }
    });
  }, [dispatch, networkName]);

  // ??????????????????
  const onClickCancel = (res: any) => {
    setCreateVisible(false);
    if (res) {
      getNetworkInfo();
    }
  };

  // ??????????????????
  const onCreateNetwork = useCallback(() => {
    if (serverTotal === 0) {
      message.warn('?????????????????????????????????????????????????????????');
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
      content: `????????????????????? ???${networkName}??? ????`,
      okText: '??????',
      cancelText: '??????',
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
            loadingDescription: '??????????????????????????????, ??????????????????, ??????????????????'
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
      content: `????????????????????? ???${networkName}??? ????`,
      okText: '??????',
      cancelText: '??????',
      onOk: confirm
    });
  }, [dispatch, networkName, pollInterval]);

  // ?????????????????????
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

  // ??????????????????
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

  // ??????????????????
  const onClickBlockDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: BlockSchema) => {
    e.preventDefault();
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

  // ??????????????????
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

  // ??????????????????
  const onClickTransactionDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: TransactionSchema) => {
    e.preventDefault();
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
      title: '??????HASH',
      dataIndex: 'blockHash',
      key: 'blockHash',
      ellipsis: true,
      width: userRole === Roles.NetworkMember ? '17%' : '20%'
    },
    {
      title: '????????????',
      dataIndex: 'channelId',
      key: 'channelId'
    },
    {
      title: '????????????',
      dataIndex: 'txCount',
      key: 'txCount'
    },
    {
      title: '????????????',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '??????',
      key: 'action',
      render: (text, record: BlockSchema) => (
        <Space size="small">
          <a href={`/about/block/${record.blockHash}`} onClick={(e) => onClickBlockDetail(e, record)}>
            ??????
          </a>
        </Space>
      )
    }
  ];
  const transactionColumns: ColumnsType<any> = [
    {
      title: '??????ID',
      dataIndex: 'txId',
      key: 'txId',
      ellipsis: true,
      width: '17%'
    },
    {
      title: '????????????',
      dataIndex: 'channelId',
      key: 'channelId',
      render: (text) => text || <span className="a-forbidden-style">??????????????????</span>
    },
    {
      title: '????????????',
      dataIndex: 'txMsp',
      key: 'txMsp',
      render: (text) => text || <span className="a-forbidden-style">??????????????????</span>
    },
    {
      title: '????????????',
      dataIndex: 'chainCodeName',
      key: 'chainCodeName',
      render: (text) => text || <span className="a-forbidden-style">??????????????????</span>
    },
    {
      title: '????????????',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : <span className="a-forbidden-style">??????????????????</span>
    },
    {
      title: '??????',
      key: 'action',
      render: (text, record: TransactionSchema) => (
        <Space size="small">
          {record.channelId || record.txMsp ? (
            <a href={`/about/transactions/${record.txId}`} onClick={(e) => onClickTransactionDetail(e, record)}>
              ??????
            </a>
          ) : (
            <a
              href={`/about/transactions/${record.txId}`}
              className="a-forbidden-style"
              onClick={(e) => e.preventDefault()}>
              ??????
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
    if (userRole === Roles.NetworkAdmin) {
      const status = networkStatusInfo?.networkStatus;
      switch (status) {
        case NetworkStatus.NotExist:
          btnShowInitValue.extraButton = (
            <Col span={8}>
              <Button type="primary" onClick={onCreateNetwork}>
                ????????????
              </Button>
            </Col>
          );
          break;
        case NetworkStatus.Stopped:
          btnShowInitValue.extraButton = (
            <Col span={2}>
              <Button type="primary" onClick={onRestartNetwork}>
                ????????????
              </Button>
            </Col>
          );
          break;
        case NetworkStatus.Running:
          if (channelTotal === 0) {
            btnShowInitValue.createChannelLink = (
              <>
                <span className={style.description}>???????????????????????????</span>
                <a href="/about/channels" onClick={linkToCreateChannel}>
                  ?????????
                </a>
              </>
            );
          } else {
            btnShowInitValue.extraButton = (
              <Col span={2}>
                <Button type="primary" onClick={onStopNetwork}>
                  ????????????
                </Button>
              </Col>
            );
          }
          break;
        default:
          break;
      }
      if (status && CanDeleteNetworkStatus.includes(status)) {
        btnShowInitValue.deleteButton = (
          <Col span={2}>
            <Button type="primary" onClick={onDeleteNetwork}>
              ????????????
            </Button>
          </Col>
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
    // ??????
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
  }, [
    getBlockList,
    getNetworkInfo,
    getStaticInfo,
    getTransactionList,
    networkStatusInfo?.networkStatus
  ]);

  useEffect(() => {
    dispatch({
      type: 'ElasticServer/getServerTotal',
      payload: {}
    });
    dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: '/about/league-dashboard' },
    });
    localStorage.setItem(LOCAL_STORAGE_ITEM_KEY.NETWORK_PORTAL_SELECTED_MENU, '/about/league-dashboard')
  }, [dispatch]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryNetworkLoading || stopNetworkLoading || restartNetworkLoading}>
          <div className={style['league-basic-info']}>
            <Row>
              <Col span={8}>
                <label>???????????????</label>
                <span className={style.description}>{leagueName}</span>
              </Col>
              <Col span={8}>
                <label>???????????????</label>
                <span className={style.description}>
                  {networkStatusInfo ? moment(networkStatusInfo.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''}
                </span>
              </Col>
              <Col span={8}>
                <label>????????????: </label>
                <span className={style.description}>
                  {networkStatusInfo ? NetworkInfo[networkStatusInfo.networkStatus] : ''}
                </span>
                {btnShow.createChannelLink}
              </Col>
              {btnShow.extraButton}
              {btnShow.deleteButton}
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
  stopNetworkLoading: loading.effects['Dashboard/stopNetwork'],
  restartNetworkLoading: loading.effects['Dashboard/restartNetwork'],
  qryTransactionLoading: loading.effects['Dashboard/getTransactionList']
}))(LeagueDashboard);
