import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { Dispatch, EvidenceSchema, history } from 'umi';
import { Table, Space, Button } from 'antd';
import moment from 'moment';
import { PageTitle, SearchBar } from '~/components';
import baseConfig from '~/utils/config';
import EvidenceOnChain from './components/EvidenceOnChain';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';

export interface EvidenceDataListProps {
  User: ConnectState['User'];
  Evidence: ConnectState['Evidence'];
  qryLoading: boolean;
  dispatch: Dispatch;
}
function EvidenceDataList(props: EvidenceDataListProps) {
  const { User, Evidence, qryLoading, dispatch } = props;
  const { evidenceDataList, evidenceDataTotal } = Evidence;
  const { networkName } = User;
  const [pageNum, setPageNum] = useState(1);
  const [evidenceHash, setEvidenceHash] = useState('');
  const [uploadVisible, setUploadVisible] = useState(false);
  const [pageSize] = useState(baseConfig.pageSize);

  const columns: ColumnsType<any> = [
    {
      title: '哈希',
      dataIndex: 'evidenceHash',
      key: 'evidenceHash',
      ellipsis: true,
      width: '20%'
    },
    {
      title: '所属通道',
      dataIndex: 'channelId',
      key: 'channelId'
    },
    {
      title: '创建用户',
      dataIndex: 'companyName',
      key: 'companyName'
    },
    {
      title: '上链时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '')
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record: EvidenceSchema) => (
        <Space size="small">
          <a href={`/about/Evidence/${record.evidenceHash}`} onClick={(e) => onClickDetail(e, record)}>
            详情
          </a>
        </Space>
      )
    }
  ];
  // 点击查看详情
  const onClickDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: EvidenceSchema) => {
    e.preventDefault();
    history.push({
      pathname: `/about/Evidence/${record.evidenceHash}`,
      query: {
        evidenceHash: record.evidenceHash,
        channelId: record.channelId
      }
    });
  };

  // 点击存证上链
  const onClickUpload = () => {
    setUploadVisible(true);
  };

  // 取消存证上链
  const onCloseUpload = (res: any) => {
    setUploadVisible(false);
    if (res === 'refresh') {
      getEvidenceTotalDocs();
      getEvidenceDataList();
    }
  };

  // 查询列表
  const getEvidenceDataList = useCallback(() => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      networkName,
      limit: pageSize,
      offset: offset,
      ascend: false,
      from: Number(moment(new Date()).format('x'))
    };
    if (evidenceHash) {
      dispatch({
        type: 'Evidence/getEvidenceDataByHash',
        payload: { networkName, evidenceHash }
      });
      return;
    }
    dispatch({
      type: 'Evidence/getEvidenceDataList',
      payload: params
    });
  }, [dispatch, evidenceHash, networkName, pageNum, pageSize]);

  const getEvidenceTotalDocs = useCallback(() => {
    const params = {
      networkName
    };
    dispatch({
      type: 'Evidence/getEvidenceTotalDocs',
      payload: params
    });
  }, [dispatch, networkName]);

  // 搜索
  const onSearch = (value: string, event: { type: string }) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      setPageNum(1);
      setEvidenceHash(value || '');
    }
  };

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getEvidenceDataList();
    if (!evidenceHash) {
      getEvidenceTotalDocs();
    }
  }, [evidenceHash, getEvidenceDataList, getEvidenceTotalDocs, pageNum]);

  return (
    <div className="page-wrapper">
      <PageTitle label="存证上链" extra={
        <Button type="primary" onClick={onClickUpload}>
          存证上链
        </Button>}
      />
      <div className="page-content page-content-shadow table-wrapper">
        <SearchBar placeholder="输入存证哈希" onSearch={onSearch} />
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
            position: ['bottomCenter']
          }}
        />
      </div>
      {uploadVisible && <EvidenceOnChain visible={uploadVisible} onCancel={onCloseUpload} />}
    </div>
  );
}

export default connect(({ User, Evidence, loading }: ConnectState) => ({
  User,
  Evidence,
  qryLoading:
    loading.effects['Evidence/getEvidenceDataList'] ||
    loading.effects['Evidence/getEvidenceDataByHash'] ||
    loading.effects['Evidence/getEvidenceTotalDocs']
}))(EvidenceDataList);
