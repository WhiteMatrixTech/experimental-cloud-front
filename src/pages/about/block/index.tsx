import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Dispatch, history } from 'umi';
import { Table, Space } from 'antd';
import moment from 'moment';
import { Breadcrumb, SearchBar } from '~/components';
import baseConfig from '~/utils/config';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/block');

export interface BlockProps {
  Block: ConnectState['Block'];
  qryLoading: boolean;
  dispatch: Dispatch;
  User: ConnectState['User'];
}

const Block: React.FC<BlockProps> = (props) => {
  const { Block, qryLoading, dispatch, User } = props;
  const { networkName } = User;
  const { blockList, blockTotal } = Block;
  const [pageNum, setPageNum] = useState(1);
  const [blockHash, setBlockHash] = useState('');
  const [pageSize] = useState(baseConfig.pageSize);

  //查询列表的totalDocs
  const getBlockTotalDocs = (): void => {
    const params = {
      networkName,
    };
    dispatch({
      type: 'Block/getBlockTotalDocs',
      payload: params,
    });
  };
  //查询列表current
  const getBlockList = (): void => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      networkName,
      limit: pageSize,
      offset: offset,
      ascend: false,
    };
    dispatch({
      type: 'Block/getBlockList',
      payload: params,
    });
  };

  // 搜索
  const onSearch = (value: string, event: any): void => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      setPageNum(1);
      setBlockHash(value || '');
    }
  };

  //搜索列表
  const onSearchList = (): void => {
    const params = {
      networkName,
      blockHash,
    };
    dispatch({
      type: 'Block/onSearch',
      payload: params,
    });
  };

  // 翻页
  const onPageChange = (pageInfo: any): void => {
    setPageNum(pageInfo.current);
  };

  // 点击查看详情
  const onClickDetail = (record: {
    channelId?: string | undefined;
    txCount?: number | undefined;
    blockHash: string;
  }): void => {
    history.push({
      pathname: `/about/block/${record.blockHash}`,
      query: {
        blockHash: record.blockHash,
      },
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: '区块HASH',
      dataIndex: 'blockHash',
      key: 'blockHash',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '所属通道',
      dataIndex: 'channelId',
      key: 'channelId',
      render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>,
    },
    {
      title: '交易数量',
      dataIndex: 'txCount',
      key: 'txCount',
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
      render: (text, record: { channelId?: string; txCount?: number; blockHash: string }) => (
        <Space size="small">
          {record.channelId || record.txCount ? (
            <a onClick={() => onClickDetail(record)}>详情</a>
          ) : (
            <a className="a-forbidden-style">详情</a>
          )}{' '}
        </Space>
      ),
    },
  ];

  // 页码改变时,或搜索值blockHash=''时重新查询列表
  useEffect(() => {
    if (blockHash) {
      onSearchList();
    } else {
      getBlockList();
      getBlockTotalDocs();
    }
  }, [blockHash, pageNum]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        <SearchBar placeholder="区块HASH" onSearch={onSearch} />
        <Table
          rowKey="blockHash"
          columns={columns}
          loading={qryLoading}
          dataSource={blockList}
          onChange={onPageChange}
          pagination={{
            pageSize,
            total: blockTotal,
            current: pageNum,
            showSizeChanger: false,
            position: ['bottomCenter'],
          }}
        />
      </div>
    </div>
  );
};

export default connect(({ User, Block, loading }: ConnectState) => ({
  User,
  Block,
  qryLoading: loading.effects['Block/getBlockList'],
}))(Block);
