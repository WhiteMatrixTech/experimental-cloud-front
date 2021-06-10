import React, { useEffect, useCallback } from 'react';
import { Table, Space, Col, Row } from 'antd';
import { connect } from 'dva';
import { ChannelSchema, Dispatch, history, Location } from 'umi';
import moment from 'moment';
import { StatisticsCard, Breadcrumb } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { ChannelStatus } from '../../_config';
import style from './index.less';
import config from '~/utils/config';
import peer from '~/assets/images/dashboard/icon-peer.png';
import msp from '~/assets/images/dashboard/icon-msp.png';
import chaincode from '~/assets/images/dashboard/icon-chaincode.png';
import block from '~/assets/images/dashboard/icon-block.png';
import transactions from '~/assets/images/dashboard/icon-transcation.png';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';
import { Intl } from '~/utils/locales';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channels');
breadCrumbItem.push({
  menuName: Intl.formatMessage('BASS_CHANNEL_DESCRIPTION'),
  menuHref: `/`
});

const imgList = [msp, peer, block, transactions, chaincode];
export interface ChannelDetailProps {
  dispatch: Dispatch;
  User: ConnectState['User'];
  qryBlockLoading: boolean;
  qryTransactionLoading: boolean;
  Channel: ConnectState['Channel'];
  location: Location<ChannelSchema>;
  match: { params: { channelId: string } };
}
const ChannelDetail: React.FC<ChannelDetailProps> = (props) => {
  const {
    dispatch,
    User,
    qryBlockLoading,
    qryTransactionLoading,
    location,
    match: {
      params: { channelId }
    }
  } = props;
  const {
    blockListOfChannel,
    transactionListOfChannel,
    orgTotalOfChannel,
    nodeTotalOfChannel,
    blockTotalOfChannel,
    contractTotalOfChannel,
    transactionTotalOfChannel
  } = props.Channel;
  const statisticsList = [
    { label: Intl.formatMessage('BASS_CHANNEL_ORGANIZATION'), num: orgTotalOfChannel },
    { label: Intl.formatMessage('BASS_CHANNEL_NODE'), num: nodeTotalOfChannel },
    { label: Intl.formatMessage('BASS_CHANNEL_BLOCK'), num: blockTotalOfChannel },
    { label: Intl.formatMessage('BASS_CHANNEL_TRANSACTIONS'), num: transactionTotalOfChannel },
    { label: Intl.formatMessage('BASS_CHANNEL_CONTRACT'), num: contractTotalOfChannel }
  ];
  const blockColumns: ColumnsType<any> = [
    {
      title: Intl.formatMessage('BASS_BLOCK_BLOCK_HASH'),
      dataIndex: 'blockHash',
      key: 'blockHash',
      ellipsis: true
    },
    {
      title: Intl.formatMessage('BASS_COMMON_CHANNEL'),
      dataIndex: 'channelId',
      key: 'channelId'
    },
    {
      title: Intl.formatMessage('BASS_BLOCK_NUMBER_OF_TRANSACTION'),
      dataIndex: 'txCount',
      key: 'txCount'
    },
    {
      title: Intl.formatMessage('BASS_COMMON_GENERATED_TIME'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: Intl.formatMessage('BASS_COMMON_OPERATION'),
      key: 'action',
      render: (text, record) => (
        <Space size="small">
          <a
            href={`/about/block/${record.blockHash}`}
            onClick={(e) => onClickBlockDetail(e, record)}>
            {Intl.formatMessage('BASS_COMMON_DETAILED_INFORMATION')}
          </a>
        </Space>
      )
    }
  ];
  const transactionColumns: ColumnsType<any> = [
    {
      title: Intl.formatMessage('BASS_TRANSACTION_ID'),
      dataIndex: 'txId',
      key: 'txId',
      ellipsis: true,
      width: '17%'
    },
    {
      title: Intl.formatMessage('BASS_COMMON_CHANNEL'),
      dataIndex: 'channelId',
      key: 'channelId',
      render: (text) =>
        text || <span className="a-forbidden-style">{Intl.formatMessage('BASS_COMMON_LIMIT_ACCESS')}</span>
    },
    {
      title: Intl.formatMessage('BASS_TRANSACTION_ORGANIZATION'),
      dataIndex: 'txEndorseMsp',
      key: 'txEndorseMsp',
      render: (text) =>
        text || <span className="a-forbidden-style">{Intl.formatMessage('BASS_COMMON_LIMIT_ACCESS')}</span>
    },
    {
      title: Intl.formatMessage('BASS_TRANSACTION_CONTRACT_NAME'),
      dataIndex: 'chainCodeName',
      key: 'chainCodeName',
      render: (text) =>
        text || <span className="a-forbidden-style">{Intl.formatMessage('BASS_COMMON_LIMIT_ACCESS')}</span>
    },
    {
      title: Intl.formatMessage('BASS_COMMON_GENERATED_TIME'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) =>
        text ? (
          moment(text).format('YYYY-MM-DD HH:mm:ss')
        ) : (
          <span className="a-forbidden-style">{Intl.formatMessage('BASS_COMMON_LIMIT_ACCESS')}</span>
        )
    },
    {
      title: Intl.formatMessage('BASS_COMMON_OPERATION'),
      key: 'action',
      render: (text, record) => (
        <Space size="small">
          {record.channelId || record.txEndorseMsp ? (
            <a href={`/about/transactions/${record.txId}`} onClick={(e) => onClickTransactionDetail(e, record)}>详情</a>
          ) : (
            <a
              href={`/about/transactions/${record.txId}`}
              className="a-forbidden-style"
              onClick={(e) => e.preventDefault()}>
              {Intl.formatMessage('BASS_COMMON_DETAILED_INFORMATION')}
            </a>
          )}
        </Space>
      )
    }
  ];

  // 获取汇总信息
  const getStaticInfo = useCallback(() => {
    const { networkName } = User;
    const params = {
      networkName,
      channelId
    };
    dispatch({
      type: 'Channel/getStaticInfo',
      payload: params
    });
  }, [User, channelId, dispatch]);

  // 获取交易列表
  const getTransactionList = useCallback(() => {
    const { networkName } = User;
    const params = {
      networkName,
      offset: 0,
      limit: config.pageSize,
      ascend: false,
      channelId
    };
    dispatch({
      type: 'Channel/getTransactionsListOfChannel',
      payload: params
    });
  }, [User, channelId, dispatch]);

  // 查看交易详情
  const onClickTransactionDetail = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    record: { txId: string }
  ) => {
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

  // 获取区块列表和总数
  const getBlockList = useCallback(() => {
    const { networkName } = User;
    const params = {
      networkName,
      offset: 0,
      limit: config.pageSize,
      ascend: false,
      channelId
    };
    dispatch({
      type: 'Channel/getBlockListOfChannel',
      payload: params
    });
  }, [User, channelId, dispatch]);

  // 查看区块详情
  const onClickBlockDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: { blockHash: string }) => {
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

  useEffect(() => {
    getStaticInfo();
    getBlockList();
    getTransactionList();
  }, [getBlockList, getStaticInfo, getTransactionList]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <div className={style['channel-basic-info']}>
          <Row>
            <Col span={8}>
              <label>{Intl.formatMessage('BASS_CHANNEL_ID')}：</label>
              <span>{location?.state?._id}</span>
            </Col>
            <Col span={8}>
              <label>{Intl.formatMessage('BASS_CHANNEL_NAME')}：</label>
              <span>{location?.state?.channelId}</span>
            </Col>
            <Col span={8}>
              <label>{Intl.formatMessage('BASS_CHANNEL_ALIAS')}：</label>
              <span>{location?.state?.channelAliasName}</span>
            </Col>
            <Col span={8}>
              <label>{Intl.formatMessage('BASS_COMMON_CREATE_TIME')}：</label>
              <span>
                {location?.state?.createdAt ? moment(location?.state?.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''}
              </span>
            </Col>
            <Col span={8}>
              <label>{Intl.formatMessage('BASS_COMMON_STATUS')}：</label>
              <span>{location?.state?.channelStatus ? ChannelStatus[location?.state?.channelStatus].text : ''}</span>
            </Col>
          </Row>
        </div>
        <StatisticsCard statisticsList={statisticsList} imgList={imgList} />
        <Table
          rowKey="_id"
          columns={blockColumns}
          loading={qryBlockLoading}
          dataSource={blockListOfChannel}
          className="page-content-shadow"
          pagination={false}
        />
        <Table
          rowKey="_id"
          columns={transactionColumns}
          loading={qryTransactionLoading}
          dataSource={transactionListOfChannel}
          className="page-content-shadow"
          pagination={false}
        />
      </div>
    </div>
  );
}

export default connect(({ Layout, Channel, User, loading }: ConnectState) => ({
  Layout,
  Channel,
  User,
  qryBlockLoading: loading.effects['Channel/getBlockListOfChannel'],
  qryTransactionLoading: loading.effects['Channel/getTransactionList']
}))(ChannelDetail);
