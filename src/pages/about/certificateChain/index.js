import React, { useState, useEffect } from 'react';
import { connect } from "dva";
import { Table, Space, Button } from 'antd';
import moment from 'moment';
import { Breadcrumb } from 'components';
import baseConfig from 'utils/config';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import UploadChain from './components/UploadChain';
import styles from './index.less';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/certificateChain')

function CertificateChain(props) {
  const { CertificateChain, qryLoading, dispatch } = props;
  const { certificateChainList, certificateChainTotal } = CertificateChain;
  const [pageNum, setPageNum] = useState(1);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [pageSize] = useState(baseConfig.pageSize);

  const columns = [
    {
      title: '哈希',
      dataIndex: 'hash',
      key: 'hash',
    },
    {
      title: '所属通道',
      dataIndex: 'channelId',
      key: 'channelId',
    },
    {
      title: '创建组织',
      dataIndex: 'createOrgName',
      key: 'createOrgName',
    },
    {
      title: '上链时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="small">
          <a onClick={() => this.onClickDetail(record)}>详情</a>
        </Space>
      ),
    },
  ]

  // 点击存证上链
  const onClickUpload = () => {
    setUploadVisible(true)
  }

  // 取消存证上链
  const onCloseUpload = () => {
    setUploadVisible(false)
  }

  // 查询列表
  const getCertificateChainList = () => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      offset,
      isLeague: -1,
      limit: pageSize,
      from: Number(moment(new Date()).format('x'))
    }
    dispatch({
      type: 'CertificateChain/getCertificateChainList',
      payload: params
    })
  }

  // 翻页
  const onPageChange = pageInfo => {
    setPageNum(pageInfo.current)
  }

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getCertificateChainList();
  }, [pageNum]);

  return (
    <div className='page-wrapper'>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className='page-content page-content-shadow'>
        <div className={styles['search-wrapper']}>
          <Button type='primary' onClick={onClickUpload}>存证上链</Button>
        </div>
        <Table
          rowKey='id'
          columns={columns}
          loading={qryLoading}
          dataSource={certificateChainList}
          onChange={onPageChange}
          pagination={{ pageSize, total: certificateChainTotal, current: pageNum, position: ['bottomCenter'] }}
        />
      </div>
      {uploadVisible && <UploadChain visible={uploadVisible} onCancel={onCloseUpload} />}
    </div >
  )
}

export default connect(({ CertificateChain, loading }) => ({
  CertificateChain,
  qryLoading: loading.effects['CertificateChain/getCertificateChainList'],
}))(CertificateChain);
