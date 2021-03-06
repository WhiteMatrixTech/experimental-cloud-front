import React, { useState, useEffect, useMemo, Fragment, useCallback } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Dispatch, history, TransactionSchema } from 'umi';
import { Table, Space, Row, Col, Spin } from 'antd';
import { Breadcrumb } from '~/components';
import baseConfig from '~/utils/config';
import styles from './index.less';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { ConnectState } from '~/models/connect';
import { DetailViewAttr } from '~/utils/types';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/block');
breadCrumbItem.push({
  menuName: '区块详情',
  menuHref: `/`
});

export interface BlockDetailProps {
  match: { params: { blockHash: string } };
  User: ConnectState['User'];
  Block: ConnectState['Block'];
  qryLoading: boolean;
  dispatch: Dispatch;
}

const BlockDetail: React.FC<BlockDetailProps> = ({
  match: {
    params: { blockHash }
  },
  User,
  Block,
  qryLoading = false,
  dispatch
}) => {
  const { networkName } = User;
  const { blockDetail, transactionList, transactionTotal } = Block;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);

  const columns = [
    {
      title: '交易ID',
      dataIndex: 'txId',
      key: 'txId',
      ellipsis: true,
      width: '20%'
    },
    {
      title: '所属通道',
      dataIndex: 'channelId',
      key: 'channelId',
      render: (text: string) => text || <span className="a-forbidden-style">信息访问受限</span>
    },
    {
      title: '交易组织',
      dataIndex: 'txMsp',
      key: 'txMsp',
      render: (text: string) => text || <span className="a-forbidden-style">信息访问受限</span>
    },
    {
      title: '合约名称',
      dataIndex: 'chainCodeName',
      key: 'chainCodeName',
      render: (text: string) => text || <span className="a-forbidden-style">信息访问受限</span>
    },
    {
      title: '生成时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : <span className="a-forbidden-style">信息访问受限</span>
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: TransactionSchema) => (
        <Space size="small">
          {record.channelId || record.txMsp ? (
            <a href={`/about/transactions/${record.txId}`} onClick={(e) => onClickDetail(e, record)}>
              详情
            </a>
          ) : (
            <a
              href={`/about/transactions/${record.txId}`}
              className="a-forbidden-style"
              onClick={(e) => e.preventDefault()}>
              详情
            </a>
          )}
        </Space>
      )
    }
  ];

  // 查询交易列表
  const getTransactionList = useCallback((): void => {
    const params = {
      blockHash,
      networkName,
      from: Number(moment(new Date()).format('x')),
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      ascend: false
    };
    dispatch({
      type: 'Block/getTransactionList',
      payload: params
    });
  }, [blockHash, dispatch, networkName, pageNum, pageSize]);

  // 翻页
  const onPageChange = (pageInfo: any): void => {
    setPageNum(pageInfo.current);
  };

  // 点击查看交易详情
  const onClickDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: TransactionSchema) => {
    e.preventDefault();
    dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: '/about/transactions' }
    });
    history.push({
      pathname: `/about/transactions/${record.txId}`,
      query: {
        channelId: record.txId
      }
    });
  };

  useEffect(() => {
    dispatch({
      type: 'Block/getBlockDetail',
      payload: { blockHash, networkName }
    });
  }, [blockHash, dispatch, networkName]);

  useEffect(() => {
    dispatch({
      type: 'Block/getTxCountByBlockHash',
      payload: { blockHash, networkName }
    });
  }, [blockHash, dispatch, networkName]);

  useEffect(() => {
    getTransactionList();
  }, [getTransactionList, pageNum]);

  const detailList: DetailViewAttr[] = useMemo(() => {
    if (blockDetail) {
      return [
        {
          label: '当前哈希值',
          value: blockDetail.blockHash
        },
        {
          label: '前序哈希值',
          value: blockDetail.previousHash
        },
        {
          label: '交易笔数',
          value: blockDetail.txCount
        },
        {
          label: '生成时间',
          value: moment(blockDetail.createdAt).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          label: '所属通道',
          value: blockDetail.channelId
        }
      ];
    }
    return [];
  }, [blockDetail]);

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
                    { xs: 8, sm: 16, md: 24, lg: 32 }
                  ]}>
                  {detailList.map((item) => (
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
                position: ['bottomCenter']
              }}
            />
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default connect(({ User, Layout, Block, loading }: ConnectState) => ({
  User,
  Layout,
  Block,
  qryLoading: loading.effects['Block/getBlockDetail'] || loading.effects['Block/getTransactionList'],
  qryListLoading: loading.effects['Block/getTransactionList']
}))(BlockDetail);
