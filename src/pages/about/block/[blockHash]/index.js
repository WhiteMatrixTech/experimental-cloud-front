import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from "dva";
import moment from 'moment';
import { history } from 'umi';
import { Table, Space, Row, Col, Spin } from 'antd';
import { Breadcrumb } from 'components';
import baseConfig from 'utils/config';
import styles from './index.less';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/block')
breadCrumbItem.push({
  menuName: "区块详情",
  menuHref: `/`,
})

function BlockDetail({
  match: {
    params: { blockHash },
  },
  Block,
  Layout,
  qryLoading = false,
}) {
  const { blockDetail, transactionList, transactionTotal } = Block;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);
  const [detailList, setDetailList] = useState([]);
  const dispatch = useDispatch();

  const columns = [
    {
      title: '交易ID',
      dataIndex: 'txId',
      key: 'txId',
      ellipsis: true,
      width: '20%'
    },
    {
      title: '交易组织',
      dataIndex: 'txMsp',
      key: 'txMsp',
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
  ];

  // 查询交易列表
  const getTransactionList = () => {
    const params = {
      blockHash,
      pageNum,
      pageSize
    }
    dispatch({
      type: 'Block/getTransactionList',
      payload: params
    })
  }

  // 翻页
  const onPageChange = pageInfo => {
    setPageNum(pageInfo.current)
  }

  // 点击查看交易详情
  const onClickDetail = record => {
    dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: '/about/channel' }
    })
    history.push({
      pathname: `/about/channel/${record.txId}`,
      query: {
        channelId: record.txId,
      },
    })
  }

  useEffect(() => {
    dispatch({
      type: 'Block/getBlockDetail',
      payload: { blockHash }
    })
  }, []);

  useEffect(() => {
    getTransactionList()
  }, [pageNum]);

  // 用户身份改变时，展示内容改变
  useEffect(() => {
    const { userType } = Layout;
    const data = [
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
        value: blockDetail.channelName
      },
    ]
    if (userType === 3) {
      const insertItem = {
        label: '所属联盟',
        value: blockDetail.leagueName
      }
      data.splice(4, 0, insertItem)
    }
    setDetailList(data)
  }, [blockDetail, Layout.userType]);

  return (
    <div className='page-wrapper'>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <Spin spinning={qryLoading}>
        <div className='page-content'>
          <div className={styles['block-detail-wrapper']}>
            <div className={styles['block-detail-title']}>
              <div className={styles['title-dot']}></div>
              <div>区块</div>
            </div>
            <div className={styles['block-detail-content']}>
              <div className={styles.blockInfoWrap}>
                <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                  {detailList.map(item =>
                    <Fragment key={item.label}>
                      <Col className={styles['gutter-row-label']} span={3}>
                        {item.label}
                      </Col>
                      <Col className={styles['gutter-row-content']} span={21}>
                        {item.value}
                      </Col>
                    </Fragment>
                  )}
                </Row>
              </div>
            </div>
          </div>
          <Table
            rowKey='txId'
            columns={columns}
            dataSource={transactionList}
            onChange={onPageChange}
            pagination={{ pageSize, total: transactionTotal, current: pageNum, position: ['bottomCenter'] }}
          />
        </div>
      </Spin>
    </div >
  )
}

export default connect(({ Layout, Block, loading }) => ({
  Layout,
  Block,
  qryLoading: loading.effects['Block/getBlockDetail'] || loading.effects['Block/getTransactionList'],
  qryListLoading: loading.effects['Block/getTransactionList'],
}))(BlockDetail);
