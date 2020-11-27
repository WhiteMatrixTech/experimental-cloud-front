import React, { useState, useEffect } from 'react';
import { connect } from "dva";
import { history } from 'umi';
import { Table, Space } from 'antd';
import moment from 'moment';
import { Breadcrumb, SearchBar } from 'components';
import baseConfig from 'utils/config';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/block')

function Block(props) {
  const { Block, Layout, qryLoading, dispatch } = props;
  const { blockList, blockTotal } = Block;
  const [columns, setColumns] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [blockHash, setBlockHash] = useState('');
  const [pageSize] = useState(baseConfig.pageSize);

  // 查询列表
  const getBlockList = () => {
    const paginator = (pageNum - 1) * pageSize;
    const params = {
      blockHash,
      limit: pageSize,
      paginator: paginator
    }
    dispatch({
      type: 'Block/getBlockList',
      payload: params
    })
  }

  // 搜索
  const onSearch = (value, event) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      setPageNum(1);
      setBlockHash(value || '')
    }
  }


  // 翻页
  const onPageChange = pageInfo => {
    setPageNum(pageInfo.current)
  }

  // 点击查看详情
  const onClickDetail = record => {
    history.push({
      pathname: `/about/block/${record.blockHash}`,
      query: {
        blockHash: record.blockHash,
      },
    })
  }
  

  // 用户身份改变时，表格展示改变
  useEffect(() => {
    const { userType } = Layout;
    const data = [
      {
        title: '区块HASH',
        dataIndex: 'blockHash',
        key: 'blockHash',
        ellipsis: true,
        width: (userType === 2) ? '20%' : '17%'
      },
      {
        title: '所属通道',
        dataIndex: 'channelName',
        key: 'channelName',
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
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="small">
            <a onClick={() => onClickDetail(record)}>详情</a>
          </Space>
        ),
      },
    ];
    if (userType === 3) {
      const insertColumn = {
        title: '所属联盟',
        dataIndex: 'leagueName',
        key: 'leagueName',
      }
      data.splice(1, 0, insertColumn)
    }
    setColumns(data)
  }, [Layout.userType]);

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getBlockList();
  }, [pageNum, blockHash]);

  return (
    <div className='page-wrapper'>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className='page-content page-content-shadow'>
        <SearchBar placeholder='区块HASH' onSearch={onSearch} />
        <Table
          rowKey='blockHash'
          columns={columns}
          loading={qryLoading}
          dataSource={blockList}
          onChange={onPageChange}
          pagination={{ pageSize, total: blockTotal, current: pageNum, position: ['bottomCenter'] }}
        />
      </div>
    </div>
  )
}

export default connect(({ Layout, Block, loading }) => ({
  Layout,
  Block,
  qryLoading: loading.effects['Block/getBlockList'],
}))(Block);
