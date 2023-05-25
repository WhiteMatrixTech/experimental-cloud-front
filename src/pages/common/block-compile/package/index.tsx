import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import { PageTitle } from '~/components';
import AddBuildRecord from './components/AddBuildRecord';
import { ColumnsType } from 'antd/lib/table';
import baseConfig from '~/utils/config';

export type SourceCodeCompilationProps = {
  qryLoading: boolean;
  dispatch: Dispatch;
  BlockChainCompile: ConnectState['BlockChainCompile'];
};
const pageSize = baseConfig.pageSize;
const SourceCodeCompilation: React.FC<SourceCodeCompilationProps> = (props) => {
  const { dispatch, qryLoading = false, BlockChainCompile } = props;
  const { buildRecords, buildRecordsTotal } = BlockChainCompile;
  const [pageNum, setPageNum] = useState(1);
  const [showAddBuildRecord, setShowAddBuildRecord] = useState(false);

  const getBuildRecords = useCallback(() => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      offset,
      limit: pageSize
    };
    dispatch({
      type: 'BlockChainCompile/getBuildRecords',
      payload: params
    });
  }, [dispatch, pageNum]);

  const onClickOneKeyCompile = () => {
    setShowAddBuildRecord(true);
  };

  const onCancel = () => {
    setShowAddBuildRecord(false);
    getBuildRecords();
  };

  useEffect(() => {
    getBuildRecords();
  }, [getBuildRecords, pageNum]);

  const columns: ColumnsType<any> = [
    {
      title: '仓库地址',
      dataIndex: 'gitRepo',
      key: 'gitRepo',
      ellipsis: true
    },
    {
      title: '分支名',
      dataIndex: 'gitRef',
      key: 'gitRef',
      ellipsis: true
    },
    {
      title: '镜像仓库地址',
      dataIndex: 'registryUrl',
      key: 'registryUrl',
      ellipsis: true
    },
    {
      title: '编译参数',
      dataIndex: 'buildArgs',
      key: 'buildArgs',
      ellipsis: true
    },
    {
      title: '编译任务ID',
      dataIndex: 'jobId',
      key: 'jobId',
      ellipsis: true
    },
    {
      title: '编译任务状态',
      dataIndex: 'status',
      key: 'status',
      ellipsis: true
    }
  ];

  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  return (
    <div className="page-wrapper">
      <PageTitle
        label="一键编译"
        extra={
          <Button type="primary" onClick={onClickOneKeyCompile}>
            一键编译
          </Button>
        }
      />
      <div className="page-content page-content-shadow table-wrapper">
        <Table
          rowKey="jobId"
          loading={qryLoading}
          columns={columns}
          dataSource={buildRecords}
          onChange={onPageChange}
          pagination={{
            total: buildRecordsTotal,
            current: pageNum,
            showSizeChanger: false,
            position: ['bottomCenter'],
            pageSize: pageSize
          }}
        />
      </div>
      {showAddBuildRecord && <AddBuildRecord visible={showAddBuildRecord} onCancel={onCancel} />}
    </div>
  );
};

export default connect(({ User, BlockChainCompile, loading }: ConnectState) => ({
  User,
  BlockChainCompile,
  qryLoading: loading.effects['BlockChainCompile/getBuildRecords']
}))(SourceCodeCompilation);
