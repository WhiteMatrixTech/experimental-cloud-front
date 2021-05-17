import React, { useState, useEffect } from 'react';
import { Table, Space } from 'antd';
import { connect } from 'dva';
import { Dispatch, history } from 'umi';
import { ConnectState } from '@/models/connect';
import { Breadcrumb } from '@/components';
import { CommonMenuList, getCurBreadcrumb } from '@/utils/menu';
import { TableColumnsAttr } from '@/utils/types';
import { JobSchema } from '@/models/block-chain-compile';
import baseConfig from '@/utils/config';

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/job-management', false);

export type SourceCodeCompilationProps = {
  qryLoading: boolean;
  dispatch: Dispatch;
  BlockChainCompile: ConnectState['BlockChainCompile'];
};

const SourceCodeCompilation: React.FC<SourceCodeCompilationProps> = (props) => {
  const { dispatch, qryLoading = false, BlockChainCompile } = props;
  const { jobList, jobTotal } = BlockChainCompile;
  const [pageNum, setPageNum] = useState(1);

  const getJobList = () => {
    dispatch({
      type: 'BlockChainCompile/getJobList',
      payload: {},
    });
  };

  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  const onViewJobLog = (record: JobSchema) => {
    history.push({
      pathname: `/common/job-management/job-logs`,
      state: { ...record },
    });
  };

  const columns: TableColumnsAttr[] = [
    {
      title: '任务ID',
      dataIndex: 'jobId',
      key: 'jobId',
      ellipsis: true,
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
      key: 'jobName',
      ellipsis: true,
    },
    {
      title: '任务类别',
      dataIndex: 'jobCategory',
      key: 'jobCategory',
      ellipsis: true,
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      key: 'status',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record: JobSchema) => (
        <Space size="small">
          <a onClick={() => onViewJobLog(record)}>查看日志</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getJobList();
  }, []);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        <Table
          rowKey="jobId"
          loading={qryLoading}
          columns={columns}
          dataSource={jobList}
          onChange={onPageChange}
          pagination={{
            pageSize: baseConfig.pageSize,
            total: jobTotal,
            current: pageNum,
            showSizeChanger: false,
            position: ['bottomCenter'],
          }}
        />
      </div>
    </div>
  );
};

export default connect(({ User, BlockChainCompile, loading }: ConnectState) => ({
  User,
  BlockChainCompile,
  qryLoading: loading.effects['BlockChainCompile/getJobList'] || loading.effects['BlockChainCompile/getJobById'],
}))(SourceCodeCompilation);
