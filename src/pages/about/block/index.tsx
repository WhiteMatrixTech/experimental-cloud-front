import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { BlockSchema, Dispatch, history } from 'umi';
import { Table, Space, Form, Spin, Input, Row, Col, Button } from 'antd';
import moment from 'moment';
import { PageTitle } from '~/components';
import baseConfig from '~/utils/config';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';

const pageSize = baseConfig.pageSize;
export interface BlockProps {
  Block: ConnectState['Block'];
  qryLoading: boolean;
  dispatch: Dispatch;
  User: ConnectState['User'];
}

const Block: React.FC<BlockProps> = (props) => {
  const { Block, qryLoading = false, dispatch, User } = props;
  const { networkName } = User;
  const { blockList, blockTotal } = Block;

  const [form] = Form.useForm();
  const [pageNum, setPageNum] = useState(1);
  const [searchParams, setSearchParams] = useState({ blockHash: '' });

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
  }, [dispatch, networkName, pageNum]);

  // 搜索
  const onSearch = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        setPageNum(1);
        setSearchParams({ blockHash: values.blockHash });
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  }, [form]);

  // 重置
  const resetForm = () => {
    form.resetFields();
    setPageNum(1);
    setSearchParams({ blockHash: '' });
  };

  //搜索列表
  const onSearchList = useCallback(() => {
    const params = {
      networkName,
      blockHash: searchParams.blockHash
    };
    dispatch({
      type: 'Block/onSearch',
      payload: params
    });
  }, [dispatch, networkName, searchParams.blockHash]);

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
      title: '区块哈希',
      dataIndex: 'blockHash',
      key: 'blockHash',
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
      title: '交易数量',
      dataIndex: 'txCount',
      key: 'txCount',
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
      key: 'action',
      render: (text, record: BlockSchema) => (
        <Space size="small">
          {record.channelId || record.txCount ? (
            <a href={`/about/block/${record.blockHash}`} onClick={(e) => onClickDetail(e, record)}>
              详情
            </a>
          ) : (
            <a
              href={`/about/block/${record.blockHash}`}
              className="a-forbidden-style"
              onClick={(e) => e.preventDefault()}>
              详情
            </a>
          )}{' '}
        </Space>
      )
    }
  ];

  // 页码改变时,或搜索值blockHash=''时重新查询列表
  useEffect(() => {
    const { blockHash } = searchParams;
    if (blockHash) {
      onSearchList();
    } else {
      getBlockList();
      getBlockTotalDocs();
    }
  }, [searchParams, getBlockList, getBlockTotalDocs, onSearchList, pageNum]);

  return (
    <div className="page-wrapper">
      <PageTitle label="区块数据" />
      <div className="page-content page-content-shadow table-wrapper">
        <Spin spinning={qryLoading}>
          <div className="table-header-search-wrapper">
            <Form form={form}>
              <Row>
                <Col span={8}>
                  <Form.Item label="区块哈希" name="blockHash" initialValue="">
                    <Input placeholder="输入区块哈希" />
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
        </Spin>
      </div>
    </div>
  );
};

export default connect(({ User, Block, loading }: ConnectState) => ({
  User,
  Block,
  qryLoading: loading.effects['Block/getBlockList'] || loading.effects['Block/onSearch']
}))(Block);
