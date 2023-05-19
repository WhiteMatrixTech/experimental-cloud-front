import React, { useEffect, useCallback, useState } from 'react';
import { Table, Space, Col, Row, Descriptions, Statistic, Divider } from 'antd';
import { connect } from 'dva';
import { ChannelSchema, Dispatch, history, Location } from 'umi';
import { Breadcrumb, PageTitle, PlaceHolder } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { ChannelStatusTag } from '../../_config';
import style from './index.less';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';
import { StatisticValueStyle } from '~/pages/about/league-dashboard/_style';
import baseConfig from '~/utils/config';
import { cancelCurrentRequest } from '~/utils/request';
import { formatDate, renderDateWithDefault } from '~/utils/date';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channels');
breadCrumbItem.push({
  menuName: '通道详情',
  menuHref: `/`
});

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
    { label: '组织', num: orgTotalOfChannel },
    { label: '节点', num: nodeTotalOfChannel },
    { label: '区块', num: blockTotalOfChannel },
    { label: '交易', num: transactionTotalOfChannel },
    { label: '合约', num: contractTotalOfChannel }
  ];
  const blockColumns: ColumnsType<any> = [
    {
      title: '区块HASH',
      dataIndex: 'blockHash',
      key: 'blockHash',
      ellipsis: true
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
      render: renderDateWithDefault
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
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
      render: (text) => (text ? formatDate(text) : <span className="a-forbidden-style">信息访问受限</span>)
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="small">
          {record.channelId || record.txEndorseMsp ? (
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

  const [blockPageNum, setBlockPageNum] = useState(1);
  const [blockPageSize] = useState(baseConfig.pageSize);
  // 翻页
  const onBlockPageChange = (pageInfo: any) => {
    setBlockPageNum(pageInfo.current);
  };

  const [txPageNum, setTXPageNum] = useState(1);
  const [txPageSize] = useState(baseConfig.pageSize);
  // 翻页
  const onTXPageChange = (pageInfo: any) => {
    setTXPageNum(pageInfo.current);
  };

  // 获取汇总信息
  const getStaticInfo = useCallback(() => {
    const { networkName } = User;
    const params = {
      networkName,
      channel: channelId
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
      offset: (txPageNum - 1) * txPageSize,
      limit: txPageSize,
      ascend: false,
      channel: channelId
    };
    dispatch({
      type: 'Channel/getTransactionsListOfChannel',
      payload: params
    });
  }, [User, channelId, dispatch, txPageNum, txPageSize]);

  // 查看交易详情
  const onClickTransactionDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: { txId: string }) => {
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

  // 获取区块列表和总数
  const getBlockList = useCallback(() => {
    const { networkName } = User;
    const params = {
      networkName,
      offset: (blockPageNum - 1) * blockPageSize,
      limit: blockPageSize,
      ascend: false,
      channel: channelId
    };
    dispatch({
      type: 'Channel/getBlockListOfChannel',
      payload: params
    });
  }, [User, blockPageNum, blockPageSize, channelId, dispatch]);

  useEffect(() => {
    getBlockList();
    return () => cancelCurrentRequest();
  }, [getBlockList, blockPageNum]);

  useEffect(() => {
    getTransactionList();
    return () => cancelCurrentRequest();
  }, [getTransactionList, txPageNum]);

  // 查看区块详情
  const onClickBlockDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: { blockHash: string }) => {
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

  useEffect(() => {
    getStaticInfo();
    getBlockList();
    getTransactionList();
  }, [getBlockList, getStaticInfo, getTransactionList]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <PageTitle label="通道详情" />
      <div className="page-content">
        <Descriptions title="基本信息" className={style['channel-basic-info']}>
          <Descriptions.Item label="通道名称">
            <PlaceHolder text={location?.state?.name} />
          </Descriptions.Item>
          <Descriptions.Item label="通道别名">
            <PlaceHolder text={location?.state?.alias} />
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {location?.state?.createTime ? formatDate(location?.state?.createTime) : ''}
          </Descriptions.Item>v
          <Descriptions.Item label="创建用户">
            <PlaceHolder text={location?.state?.creatorName || location?.state.creatorEmail} />
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {location?.state?.status ? ChannelStatusTag[location?.state?.status].text : ''}
          </Descriptions.Item>
        </Descriptions>
        <div className={style['channel-basic-info']}>
          <h2>通道内数据</h2>
          <Row gutter={24} justify="space-between">
            {statisticsList.map((item) => (
              <Col key={item.label} span={4}>
                <Statistic title={item.label} value={item.num} valueStyle={StatisticValueStyle} />
              </Col>
            ))}
          </Row>
        </div>
        <div className="page-content page-content-shadow table-wrapper">
          <div className="table-header-title">区块列表</div>
          <Divider />
          <Table
            rowKey="blockHash"
            columns={blockColumns}
            loading={qryBlockLoading}
            dataSource={blockListOfChannel}
            onChange={onBlockPageChange}
            pagination={{
              pageSize: blockPageSize,
              total: blockTotalOfChannel,
              current: blockPageNum,
              showSizeChanger: false,
              position: ['bottomCenter']
            }}
          />
        </div>
        <div className="page-content page-content-shadow table-wrapper">
          <div className="table-header-title">交易列表</div>
          <Divider />
          <Table
            rowKey="txHash"
            columns={transactionColumns}
            loading={qryTransactionLoading}
            dataSource={transactionListOfChannel}
            onChange={onTXPageChange}
            pagination={{
              pageSize: txPageSize,
              total: transactionTotalOfChannel,
              current: txPageNum,
              showSizeChanger: false,
              position: ['bottomCenter']
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(({ Layout, Channel, User, loading }: ConnectState) => ({
  Layout,
  Channel,
  User,
  qryBlockLoading: loading.effects['Channel/getBlockListOfChannel'],
  qryTransactionLoading: loading.effects['Channel/getTransactionList']
}))(ChannelDetail);
