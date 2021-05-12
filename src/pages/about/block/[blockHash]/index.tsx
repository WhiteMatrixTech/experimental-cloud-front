import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Dispatch, history } from 'umi';
import { Table, Space, Row, Col, Spin } from 'antd';
import { Breadcrumb } from '@/components';
import baseConfig from '@/utils/config';
import styles from './index.less';
import { MenuList, getCurBreadcrumb } from '@/utils/menu';
import { ConnectState } from '@/models/connect';
import { DataSource, Item } from '@/utils/types';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/block');
breadCrumbItem.push({
  menuName: '区块详情',
  menuHref: `/`,
});

export interface BlockDetailProps {
  match: { params: { blockHash: string } },
  User: ConnectState['User'];
  Block: ConnectState['Block'];
  qryLoading: boolean;
  dispatch: Dispatch;
}
function BlockDetail({
  match: {
    params: { blockHash },
  },
  User,
  Block,
  qryLoading = false,
  dispatch,
}: BlockDetailProps) {
  const { networkName } = User;
  const { blockDetail, transactionList, transactionTotal } = Block;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);
  const [detailList, setDetailList] = useState([]);

  const columns = [
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
      render: (text: string) => text || <span className="a-forbidden-style">信息访问受限</span>,
    },
    {
      title: '交易组织',
      dataIndex: 'txMsp',
      key: 'txMsp',
      render: (text: string) => text || <span className="a-forbidden-style">信息访问受限</span>,
    },
    {
      title: '合约名称',
      dataIndex: 'chainCodeName',
      key: 'chainCodeName',
      render: (text: string) => text || <span className="a-forbidden-style">信息访问受限</span>,
    },
    {
      title: '生成时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : <span className="a-forbidden-style">信息访问受限</span>,
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: { channelId?: string; txMsp?: string; txId?: string; }) => (
        <Space size="small">
          {record.channelId || record.txMsp ? (
            <a onClick={() => onClickDetail(record)}>详情</a>
          ) : (
            <a className="a-forbidden-style">详情</a>
          )}
        </Space>
      ),
    },
  ];

  // 查询交易列表
  const getTransactionList = (): void => {
    const params = {
      blockHash,
      networkName,
      from: Number(moment(new Date()).format('x')),
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      ascend: false,
    };
    dispatch({
      type: 'Block/getTransactionList',
      payload: params,
    });
  };

  // 翻页
  const onPageChange = (pageInfo: any): void => {
    setPageNum(pageInfo.current);
  };

  // 点击查看交易详情
  const onClickDetail = (record: { channelId?: string | undefined; txMsp?: string | undefined; txId: string; }) => {
    dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: '/about/transactions' },
    });
    history.push({
      pathname: `/about/transactions/${record.txId}`,
      query: {
        channelId: record.txId,
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'Block/getBlockDetail',
      payload: { blockHash, networkName },
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'Block/getTxCountByBlockHash',
      payload: { blockHash, networkName },
    });
  }, []);

  useEffect(() => {
    getTransactionList();
  }, [pageNum]);

  //TODO:block模块，data只是定义了还没使用，Tabel表中dataSoruce属性的值是从Block  model中取的transactionList。
  //TODO:并且blockDetail来源于model,model定义的是object,所以暂时提示的是blockDetail没有blockHash...这些属性
  const data: DataSource[] = [
    {
      label: '当前哈希值',
      value: blockDetail.blockHash,
    },
    {
      label: '前序哈希值',
      value: blockDetail.previousHash,
    },
    {
      label: '交易笔数',
      value: blockDetail.txCount,
    },
    {
      label: '生成时间',
      value: moment(blockDetail.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: '所属通道',
      value: blockDetail.channelId,
    },
  ];

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <Spin spinning={qryLoading}>
        <div className="page-content">
          <div className={styles['block-detail-wrapper']}>
            <div className={styles['block-detail-title']}>
              <div>区块信息</div>
            </div>
            <div className={styles['block-detail-content']}>
              <div className={styles.blockInfoWrap}>
                <Row
                  gutter={[
                    { xs: 8, sm: 16, md: 24, lg: 32 },
                    { xs: 8, sm: 16, md: 24, lg: 32 },
                  ]}
                >
                  {detailList.map((item: Item) => (
                    <Fragment key={item.label}>
                      <Col className={styles['gutter-row-label']} span={3}>
                        {item.label}
                      </Col>
                      <Col className={styles['gutter-row-content']} span={21}>
                        {item.value}
                      </Col>
                    </Fragment>
                  ))}
                </Row>
              </div>
            </div>
          </div>
          <div className="table-wrapper page-content-shadow">
            <Table
              rowKey="txId"
              columns={columns}
              dataSource={transactionList}
              onChange={onPageChange}
              pagination={{
                pageSize,
                total: transactionTotal,
                current: pageNum,
                position: ['bottomCenter'],
              }}
            />
          </div>
        </div>
      </Spin>
    </div>
  );
}

export default connect(({ User, Layout, Block, loading }: ConnectState) => ({
  User,
  Layout,
  Block,
  qryLoading: loading.effects['Block/getBlockDetail'] || loading.effects['Block/getTransactionList'],
  qryListLoading: loading.effects['Block/getTransactionList'],
}))(BlockDetail);
