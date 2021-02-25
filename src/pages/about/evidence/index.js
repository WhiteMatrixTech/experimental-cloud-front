import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Table, Space } from 'antd';
import moment from 'moment';
import { Breadcrumb, SearchBar } from 'components';
import baseConfig from 'utils/config';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import EvidenceOnChain from './components/EvidenceOnChain';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/certificateChain');

function EvidenceDataList(props) {
  const { User, Evidence, qryLoading, dispatch } = props;
  const { evidenceDataList, evidenceDataTotal } = Evidence;
  const { networkName } = User;
  const [pageNum, setPageNum] = useState(1);
  const [evidenceHash, setEvidenceHash] = useState('');
  const [uploadVisible, setUploadVisible] = useState(false);
  const [pageSize] = useState(baseConfig.pageSize);

  const columns = [
    {
      title: '哈希',
      dataIndex: 'evidenceHash',
      key: 'evidenceHash',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '所属通道',
      dataIndex: 'channelId',
      key: 'channelId',
    },
    {
      title: '创建公司',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: '上链时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
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
  // 点击查看详情
  const onClickDetail = (record) => {
    history.push({
      pathname: `/about/Evidence/${record.evidenceHash}`,
      query: {
        evidenceHash: record.evidenceHash,
        channelId: record.channelId,
      },
    });
  };

  // 点击存证上链
  const onClickUpload = () => {
    setUploadVisible(true);
  };

  // 取消存证上链
  const onCloseUpload = (res) => {
    setUploadVisible(false);
    if (res === 'refresh') {
      getEvidenceTotalDocs();
      getEvidenceDataList();
    }
  };

  // 查询列表
  const getEvidenceDataList = () => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      networkName,
      limit: pageSize,
      offset: offset,
      ascend: false,
      from: Number(moment(new Date()).format('x')),
    };
    if (evidenceHash) {
      dispatch({
        type: 'Evidence/getEvidenceDataByHash',
        payload: { networkName, evidenceHash },
      });
      return;
    }
    dispatch({
      type: 'Evidence/getEvidenceDataList',
      payload: params,
    });
  };

  const getEvidenceTotalDocs = () => {
    const params = {
      networkName,
    };
    dispatch({
      type: 'Evidence/getEvidenceTotalDocs',
      payload: params,
    });
  };

  // 搜索
  const onSearch = (value, event) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      setPageNum(1);
      setEvidenceHash(value || '');
    }
  };

  // 翻页
  const onPageChange = (pageInfo) => {
    setPageNum(pageInfo.current);
  };

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getEvidenceDataList();
    if (!evidenceHash) {
      getEvidenceTotalDocs();
    }
  }, [evidenceHash, pageNum]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow">
        <SearchBar placeholder="输入存证哈希" onSearch={onSearch} btnName="存证上链" onClickBtn={onClickUpload} />
        <Table
          rowKey="_id"
          columns={columns}
          loading={qryLoading}
          dataSource={evidenceDataList}
          onChange={onPageChange}
          pagination={{
            pageSize,
            total: evidenceDataTotal,
            current: pageNum,
            showSizeChanger: false,
            position: ['bottomCenter'],
          }}
        />
      </div>
      {uploadVisible && <EvidenceOnChain visible={uploadVisible} onCancel={onCloseUpload} />}
    </div>
  );
}

export default connect(({ User, Evidence, loading }) => ({
  User,
  Evidence,
  qryLoading: loading.effects['Evidence/getEvidenceDataList'] || loading.effects['Evidence/getEvidenceDataByHash'],
}))(EvidenceDataList);
