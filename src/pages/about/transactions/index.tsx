import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { Dispatch, history, TransactionSchema } from 'umi';
import { Table, Space } from 'antd';
import moment from 'moment';
import { Breadcrumb, SearchBar } from '~/components';
import baseConfig from '~/utils/config';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';
import { Intl } from '~/utils/locales';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/transactions');

export interface TransactionsProps {
  Transactions: ConnectState['Transactions'];
  qryLoading: boolean;
  dispatch: Dispatch;
  User: ConnectState['User'];
}

const Transactions: React.FC<TransactionsProps> = (props) => {
  const { Transactions, qryLoading, dispatch, User } = props;
  const { transactionList, transactionTotal } = Transactions;
  const { networkName } = User;
  const [pageNum, setPageNum] = useState(1);
  const [txId, setTxId] = useState('');
  const [pageSize] = useState(baseConfig.pageSize);

  const getTransactionTotalDocs = useCallback(() => {
    const params = {
      networkName
    };
    dispatch({
      type: 'Transactions/getTransactionTotalDocs',
      payload: params
    });
  }, [dispatch, networkName]);

  const getTransactionList = useCallback(() => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      networkName,
      limit: pageSize,
      offset: offset,
      ascend: false
    };
    dispatch({
      type: 'Transactions/getTransactionList',
      payload: params
    });
  }, [dispatch, networkName, pageNum, pageSize]);

  const onSearch = (value: string, event: any) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      setPageNum(1);
      setTxId(value || '');
    }
  };
  //搜索列表
  const onSearchList = useCallback(() => {
    const params = {
      networkName,
      txId
    };
    dispatch({
      type: 'Transactions/onSearch',
      payload: params
    });
  }, [dispatch, networkName, txId])

  const onPageChange = (pageInfo: any): void => {
    setPageNum(pageInfo.current);
  };

  // 点击查看详情
  const onClickDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: TransactionSchema): void => {
    e.preventDefault();
    history.push({
      pathname: `/about/transactions/${record.txId}`,
      query: {
        channelId: record.txId
      }
    });
  };
  const columns: ColumnsType<any> = [
    {
      title: Intl.formatMessage('BASS_TRANSACTION_ID'),
      dataIndex: 'txId',
      key: 'txId',
      ellipsis: true,
      width: '20%'
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
      dataIndex: 'txMsp',
      key: 'txMsp',
      width: '200px',
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
      //dataIndex:'action'
      key: 'action',
      render: (text, record: TransactionSchema) => (
        <Space size="small">
          {record.channelId || record.txMsp ? (
            <a href={`/about/transactions/${record.txId}`} onClick={(e) => onClickDetail(e, record)}>
              {Intl.formatMessage('BASS_COMMON_DETAILED_INFORMATION')}
            </a>
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
  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    if (txId) {
      onSearchList();
    } else {
      getTransactionList();
      getTransactionTotalDocs();
    }
  }, [txId, pageNum, onSearchList, getTransactionList, getTransactionTotalDocs]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        <SearchBar placeholder={Intl.formatMessage('BASS_TRANSACTION_ID')} onSearch={onSearch} />
        <Table
          rowKey="txId"
          columns={columns}
          loading={qryLoading}
          dataSource={transactionList}
          onChange={onPageChange}
          pagination={{
            pageSize,
            total: transactionTotal,
            current: pageNum,
            showSizeChanger: false,
            position: ['bottomCenter']
          }}
        />
      </div>
    </div>
  );
};

export default connect(({ User, Layout, Transactions, loading }: ConnectState) => ({
  User,
  Layout,
  Transactions,
  qryLoading: loading.effects['Transactions/getTransactionList']
}))(Transactions);
