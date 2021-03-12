import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Table, Space } from 'antd';
import moment from 'moment';
import { Breadcrumb, SearchBar } from 'components';
import baseConfig from 'utils/config';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/transactions');

function Transactions(props) {
  const { Transactions, qryLoading, dispatch, User } = props;
  const { transactionList, transactionTotal } = Transactions;
  const { networkName, userRole } = User;
  const [columns, setColumns] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [txId, setTxId] = useState('');
  const [pageSize] = useState(baseConfig.pageSize);

  const getTransactionTotalDocs = () => {
    const params = {
      networkName,
    };
    dispatch({
      type: 'Transactions/getTransactionTotalDocs',
      payload: params,
    });
  };
  // 查询列表
  const getTransactionList = () => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      networkName,
      limit: pageSize,
      offset: offset,
      ascend: false,
    };
    dispatch({
      type: 'Transactions/getTransactionList',
      payload: params,
    });
  };
  // 搜索
  const onSearch = (value, event) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      setPageNum(1);
      setTxId(value || '');
    }
  };
  //搜索列表
  const onSearchList = () => {
    const params = {
      networkName,
      txId,
    };
    dispatch({
      type: 'Transactions/onSearch',
      payload: params,
    });
  };
  // 翻页
  const onPageChange = (pageInfo) => {
    setPageNum(pageInfo.current);
  };

  // 点击查看详情
  const onClickDetail = (record) => {
    history.push({
      pathname: `/about/transactions/${record.txId}`,
      query: {
        channelId: record.txId,
      },
    });
  };

  //用户身份改变时，表格展示改变
  useEffect(() => {
    const data = [
      {
        title: '交易ID',
        dataIndex: 'txId',
        key: 'txId',
        ellipsis: true,
        width: '20%',
      },
      {
        title: '所属通道',
        dataIndex: 'channelId',
        key: 'channelId',
        render: (text) => text || '******',
      },
      {
        title: '交易组织',
        dataIndex: 'txMsp',
        key: 'txMsp',
        render: (text) => text || '******',
      },
      {
        title: '合约名称',
        dataIndex: 'chainCodeName',
        key: 'chainCodeName',
        render: (text) => text || '******',
      },
      {
        title: '生成时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '******'),
      },
      {
        title: '操作',
        key: 'action',
        render: (_, record) => (
          <Space size="small">
            {record.channelId || record.txMsp ? <a onClick={() => onClickDetail(record)}>详情</a> : <a className="a-forbidden-style">详情</a>}
          </Space>
        ),
      },
    ];
    setColumns(data);
  }, [userRole]);

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    if (txId) {
      onSearchList();
    } else {
      getTransactionList();
      getTransactionTotalDocs();
    }
  }, [txId, pageNum]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        <SearchBar placeholder="交易ID" onSearch={onSearch} />
        <Table
          rowKey="_id"
          columns={columns}
          loading={qryLoading}
          dataSource={transactionList}
          onChange={onPageChange}
          pagination={{
            pageSize,
            total: transactionTotal,
            current: pageNum,
            showSizeChanger: false,
            position: ['bottomCenter'],
          }}
        />
      </div>
    </div>
  );
}

export default connect(({ User, Layout, Transactions, loading }) => ({
  User,
  Layout,
  Transactions,
  qryLoading: loading.effects['Transactions/getTransactionList'],
}))(Transactions);
