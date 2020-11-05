import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from "dva";
import { history } from 'umi';
import { Table, Space } from 'antd';
import moment from 'moment';
import { Breadcrumb, SearchBar } from 'components';
import baseConfig from 'utils/config';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';

function Channel(props) {
  const { Channel, qryLoading } = props;
  const { transactionList, transactionTotal } = Channel;
  const [pageNum, setPageNum] = useState(1);
  const [txId, setTxId] = useState('');
  const [pageSize] = useState(baseConfig.pageSize);
  const dispatch = useDispatch();

  const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channel')
  const columns = [
    {
      title: '交易ID',
      dataIndex: 'txId',
      key: 'txId',
      ellipsis: true,
      width: '17%'
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
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => onClickDetail(record)}>详情</a>
        </Space>
      ),
    },
  ]

  // 查询列表
  const getBlockList = () => {
    const paginator = (pageNum - 1) * pageSize;
    const params = {
      companyId: 1,
      limit: pageSize,
      paginator: paginator
    }
    dispatch({
      type: 'Channel/getTransactionList',
      payload: params
    })
  }

  // 搜索
  const onSearch = (value, event) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      setPageNum(1);
      setTxId(value || '')
    }
  }

  // 翻页
  const onPageChange = pageInfo => {
    setPageNum(pageInfo.current)
  }

  // 点击查看详情
  const onClickDetail = record => {
    history.push({
      pathname: `/about/channel/${record.txId}`,
      query: {
        channelId: record.txId,
      },
    })
  }

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getBlockList();
  }, [pageNum, txId]);

  return (
    <div className='page-wrapper'>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className='page-content'>
        <SearchBar placeholder='交易ID' onSearch={onSearch} />
        <Table
          rowKey='txId'
          columns={columns}
          loading={qryLoading}
          dataSource={transactionList}
          onChange={onPageChange}
          pagination={{ pageSize, total: transactionTotal, current: pageNum, position: ['bottomCenter'] }}
        />
      </div>
    </div>
  )
}

export default connect(({ Layout, Channel, loading }) => ({
  Layout,
  Channel,
  qryLoading: loading.effects['Channel/getTransactionList'],
}))(Channel);
