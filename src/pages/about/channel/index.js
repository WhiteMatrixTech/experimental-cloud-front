import React, { useState, useEffect } from 'react';
import { connect } from "dva";
import { history } from 'umi';
import { Table, Space } from 'antd';
import moment from 'moment';
import { Breadcrumb, SearchBar } from 'components';
import baseConfig from 'utils/config';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channel')

function Channel(props) {
  const { Channel,Layout, qryLoading, dispatch } = props;
  const { transactionList, transactionTotal } = Channel;
  const [columns, setColumns] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [txId, setTxId] = useState('');
  const [pageSize] = useState(baseConfig.pageSize);


  // 查询列表
  const getTransactionList = () => {
    const paginator = (pageNum - 1) * pageSize;
    const params = {
      transactionId: txId,
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

  //用户身份改变时，表格展示改变
  useEffect(() => {
    const { userType } = Layout;
    const data = [
      {
        title: '交易ID',
        dataIndex: 'txId',
        key: 'txId',
        ellipsis: true,
        width: (userType === 2) ? '20%' : '17%'
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
          <Space size="small">
            <a onClick={() => onClickDetail(record)}>详情</a>
          </Space>
        ),
      },
    ]
    if (userType === 3){
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
    getTransactionList();
  }, [pageNum, txId]);

  return (
    <div className='page-wrapper'>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className='page-content page-content-shadow'>
        <SearchBar placeholder='交易ID' onSearch={onSearch} />
        <Table
          rowKey='_id'
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
