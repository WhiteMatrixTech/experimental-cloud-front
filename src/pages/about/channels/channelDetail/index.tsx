/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { Table, Space, Col, Row } from 'antd';
import { connect } from 'dva';
import { Dispatch, history } from 'umi';
import moment from 'moment';
import { StatisticsCard, Breadcrumb } from '@/components';
import { MenuList, getCurBreadcrumb } from '@/utils/menu';
import { ChannelStatus } from '../_config';
import style from './index.less';
import config from '@/utils/config';
import peer from 'assets/images/dashboard/icon-peer.png';
import msp from 'assets/images/dashboard/icon-msp.png';
import chaincode from 'assets/images/dashboard/icon-chaincode.png';
import block from 'assets/images/dashboard/icon-block.png';
import transactions from 'assets/images/dashboard/icon-transcation.png';
import { ConnectState } from '@/models/connect';
import { TableColumnsAttr } from '@/utils/types';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channels');
breadCrumbItem.push({
  menuName: '通道详情',
  menuHref: `/`,
});

const imgList = [msp, peer, block, transactions, chaincode];
export interface ChannelDetailProps {
  dispatch: Dispatch;
  location: Location;
  User: ConnectState['User'];
  qryBlockLoading: boolean;
  qryTransactionLoading: boolean;
  Channel: ConnectState['Channel'];
}
function ChannelDetail(props: ChannelDetailProps) {
  const { dispatch, location, User, qryBlockLoading, qryTransactionLoading } = props;
  const {
    blockListOfChannel,
    transactionListOfChannel,
    orgTotalOfChannel,
    nodeTotalOfChannel,
    blockTotalOfChannel,
    contractTotalOfChannel,
    transactionTotalOfChannel,
  } = props.Channel;
  const statisticsList = [
    { label: '组织', num: orgTotalOfChannel },
    { label: '节点', num: nodeTotalOfChannel },
    { label: '区块', num: blockTotalOfChannel },
    { label: '交易', num: transactionTotalOfChannel },
    { label: '合约', num: contractTotalOfChannel },
  ];
  const blockColumns: TableColumnsAttr[] = [
    {
      title: '区块HASH',
      dataIndex: 'blockHash',
      key: 'blockHash',
      ellipsis: true,
    },
    {
      title: '所属通道',
      dataIndex: 'channelId',
      key: 'channelId',
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
  const transactionColumns: TableColumnsAttr[] = [
    {
      title: '交易ID',
      dataIndex: 'txId',
      key: 'txId',
      ellipsis: true,
      width: '17%',
    },
    {
      title: '所属通道',
      dataIndex: 'channelId',
      key: 'channelId',
      render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>,
    },
    {
      title: '交易组织',
      dataIndex: 'txEndorseMsp',
      key: 'txEndorseMsp',
      render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>,
    },
    {
      title: '合约名称',
      dataIndex: 'chainCodeName',
      key: 'chainCodeName',
      render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>,
    },
    {
      title: '生成时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : <span className="a-forbidden-style">信息访问受限</span>,
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="small">
          {record.channelId || record.txEndorseMsp ? (
            <a onClick={() => onClickTransactionDetail(record)}>详情</a>
          ) : (
            <a className="a-forbidden-style">详情</a>
          )}
        </Space>
      ),
    },
  ];
  useEffect(() => {
    getStaticInfo();
    getBlockList();
    getTransactionList();
  }, [])

  // 获取汇总信息
  const getStaticInfo = () => {
    const { networkName } = User;
    const params = {
      networkName,
      channelId: location?.state?.channelId,
    };
    dispatch({
      type: 'Channel/getStaticInfo',
      payload: params,
    });
  };

  // 获取交易列表
  const getTransactionList = () => {
    const { networkName } = User;
    const params = {
      networkName,
      offset: 0,
      limit: config.pageSize,
      ascend: false,
      channelId: location?.state?.channelId,
    };
    dispatch({
      type: 'Channel/getTransactionsListOfChannel',
      payload: params,
    });
  };

  // 查看交易详情
  const onClickTransactionDetail = (record: { txId: string; }) => {
    props.dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: '/about/transactions' },
    });
    history.push({
      pathname: `/about/transactions/${record.txId}`,
      query: {
        channelId: record.txId,
      },
    });
  };

  // 获取区块列表和总数
  const getBlockList = () => {
    const { networkName } = User;
    const params = {
      networkName,
      offset: 0,
      limit: config.pageSize,
      ascend: false,
      channelId: location?.state?.channelId,
    };
    dispatch({
      type: 'Channel/getBlockListOfChannel',
      payload: params,
    });
  };

  // 查看区块详情
  const onClickBlockDetail = (record: { blockHash: string; }) => {
    props.dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: '/about/block' },
    });
    history.push({
      pathname: `/about/block/${record.blockHash}`,
      query: {
        blockHash: record.blockHash,
      },
    });
  };
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <div className={style['channel-basic-info']}>
          <Row>
            <Col span={8}>
              <label>通道ID：</label>
              <span>{location?.state?._id}</span>
            </Col>
            <Col span={8}>
              <label>通道名称：</label>
              <span>{location?.state?.channelId}</span>
            </Col>
            <Col span={8}>
              <label>通道别名：</label>
              <span>{location?.state?.channelAliasName}</span>
            </Col>
            <Col span={8}>
              <label>创建时间：</label>
              <span>
                {location?.state?.createdAt ? moment(location?.state?.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''}
              </span>
            </Col>
            <Col span={8}>
              <label>状态：</label>
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
  qryTransactionLoading: loading.effects['Channel/getTransactionList'],
}))(ChannelDetail);
