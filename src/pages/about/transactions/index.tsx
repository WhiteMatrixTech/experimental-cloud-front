import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { Dispatch, history, TransactionSchema } from 'umi';
import { Table, Space, Form, Spin, Input, Row, Col, Button } from 'antd';
import moment from 'moment';
import { PageTitle } from '~/components';
import baseConfig from '~/utils/config';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';

const pageSize = baseConfig.pageSize;
export interface TransactionsProps {
  Transactions: ConnectState['Transactions'];
  qryLoading: boolean;
  dispatch: Dispatch;
  User: ConnectState['User'];
}

const Transactions: React.FC<TransactionsProps> = (props) => {
  const { Transactions, qryLoading = false, dispatch, User } = props;
  const { transactionList, transactionTotal } = Transactions;
  const { networkName } = User;

  const [form] = Form.useForm();
  const [pageNum, setPageNum] = useState(1);
  const [searchParams, setSearchParams] = useState({ txHash: '' });

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
  }, [dispatch, networkName, pageNum]);

  // 搜索
  const onSearch = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        setPageNum(1);
        setSearchParams({ txHash: values.txHash });
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  }, [form]);

  // 重置
  const resetForm = () => {
    form.resetFields();
    setPageNum(1);
    setSearchParams({ txHash: '' });
  };

  //搜索列表
  const onSearchList = useCallback(() => {
    const { txHash } = searchParams;
    const params = {
      networkName,
      txHash
    };
    dispatch({
      type: 'Transactions/onSearch',
      payload: params
    });
  }, [dispatch, networkName, searchParams]);

  const onPageChange = (pageInfo: any): void => {
    setPageNum(pageInfo.current);
  };

  // 点击查看详情
  const onClickDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: TransactionSchema): void => {
    e.preventDefault();
    history.push({
      pathname: `/about/transactions/${record.txHash}`,
      query: {
        channelId: record.txHash
      }
    });
  };
  const columns: ColumnsType<any> = [
    {
      title: '交易哈希',
      dataIndex: 'txHash',
      key: 'txHash',
      ellipsis: true,
      width: '20%'
    },
    {
      title: '所属通道',
      dataIndex: 'channelId',
      key: 'channelId',
      render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>
    },
    {
      title: '交易组织',
      dataIndex: 'txMsp',
      key: 'txMsp',
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
      render: (text) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : <span className="a-forbidden-style">信息访问受限</span>
    },
    {
      title: '操作',
      //dataIndex:'action'
      key: 'action',
      render: (text, record: TransactionSchema) => (
        <Space size="small">
          {record.channelId || record.txMsp ? (
            <a href={`/about/transactions/${record.txHash}`} onClick={(e) => onClickDetail(e, record)}>
              详情
            </a>
          ) : (
            <a
              href={`/about/transactions/${record.txHash}`}
              className="a-forbidden-style"
              onClick={(e) => e.preventDefault()}>
              详情
            </a>
          )}
        </Space>
      )
    }
  ];
  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    const { txHash } = searchParams;
    if (txHash) {
      onSearchList();
    } else {
      getTransactionList();
      getTransactionTotalDocs();
    }
  }, [pageNum, onSearchList, getTransactionList, getTransactionTotalDocs, searchParams]);

  return (
    <div className="page-wrapper">
      <PageTitle label="交易信息" />
      <div className="page-content page-content-shadow table-wrapper">
        <Spin spinning={qryLoading}>
          <div className="table-header-search-wrapper">
            <Form form={form}>
              <Row>
                <Col span={8}>
                  <Form.Item label="交易哈希" name="txHash" initialValue="">
                    <Input placeholder="输入交易哈希" />
                  </Form.Item>
                </Col>
                <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                  <Space size="middle">
                    <Button onClick={resetForm}>重置</Button>
                    <Button type="primary" onClick={onSearch}>
                      查询
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </div>
          <Table
            rowKey="txHash"
            columns={columns}
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
        </Spin>
      </div>
    </div>
  );
};

export default connect(({ User, Layout, Transactions, loading }: ConnectState) => ({
  User,
  Layout,
  Transactions,
  qryLoading: loading.effects['Transactions/getTransactionList'] || loading.effects['Transactions/onSearch']
}))(Transactions);
