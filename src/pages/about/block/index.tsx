import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { BlockSchema, Dispatch, history } from 'umi';
import { Table, Space } from 'antd';
import moment from 'moment';
import { Breadcrumb, SearchBar } from '~/components';
import baseConfig from '~/utils/config';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';
import { Intl } from '~/utils/locales';

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

  const getBlockTotalDocs = useCallback(() => {
    const params = {
      networkName
    };
    dispatch({
      type: 'Block/getBlockTotalDocs',
      payload: params
    });
  }, [dispatch, networkName]);

  const getBlockList = useCallback(() => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      networkName,
      limit: pageSize,
      offset: offset,
      ascend: false
    };
    dispatch({
      type: 'Block/getBlockList',
      payload: params
    });
  }, [dispatch, networkName, pageNum, pageSize]);

  // 搜索
  const onSearch = (value: string, event: any): void => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      setPageNum(1);
      setBlockHash(value || '');
    }
  };

  //搜索列表
  const onSearchList = useCallback(() => {
    const params = {
      networkName,
      blockHash
    };
    dispatch({
      type: 'Block/onSearch',
      payload: params
    });
  }, [blockHash, dispatch, networkName]);

  // 翻页
  const onPageChange = (pageInfo: any): void => {
    setPageNum(pageInfo.current);
  };

  // 点击查看详情
  const onClickDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: BlockSchema): void => {
    e.preventDefault();
    history.push({
      pathname: `/about/block/${record.blockHash}`,
      query: {
        blockHash: record.blockHash
      }
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: Intl.formatMessage('BASS_BLOCK_BLOCKCHAIN'),
      dataIndex: 'blockHash',
      key: 'blockHash',
      ellipsis: true,
      width: '20%'
    },
    {
      title: Intl.formatMessage('BASS_COMMON_CHANNEL'),
      dataIndex: 'channelId',
      key: 'channelId',
      render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>
    },
    {
      title: Intl.formatMessage('BASS_BLOCK_NUMBER_OF_TRANSACTION'),
      dataIndex: 'txCount',
      key: 'txCount',
      render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>
    },
    {
      title: Intl.formatMessage('BASS_COMMON_GENERATED_TIME'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : <span className="a-forbidden-style">信息访问受限</span>
    },
    {
      title: Intl.formatMessage('BASS_COMMON_OPERATION'),
      key: 'action',
      render: (text, record: BlockSchema) => (
        <Space size="small">
          {record.channelId || record.txCount ? (
            <a href={`/about/block/${record.blockHash}`} onClick={(e) => onClickDetail(e, record)}>
              {Intl.formatMessage('BASS_COMMON_DETAILED_INFORMATION')}
            </a>
          ) : (
            <a
              href={`/about/block/${record.blockHash}`}
              className="a-forbidden-style"
              onClick={(e) => e.preventDefault()}>
              {Intl.formatMessage('BASS_COMMON_DETAILED_INFORMATION')}
            </a>
          )}{' '}
        </Space>
      )
    }
  ];

  // 页码改变时,或搜索值blockHash=''时重新查询列表
  useEffect(() => {
    if (blockHash) {
      onSearchList();
    } else {
      getBlockList();
      getBlockTotalDocs();
    }
  }, [blockHash, getBlockList, getBlockTotalDocs, onSearchList, pageNum]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        <SearchBar placeholder={Intl.formatMessage('BASS_BLOCK_BLOCK_HASH')} onSearch={onSearch} />
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
            position: ['bottomCenter']
          }}
        />
      </div>
    </div>
  );
};

export default connect(({ User, Block, loading }: ConnectState) => ({
  User,
  Block,
  qryLoading: loading.effects['Block/getBlockList']
}))(Block);
