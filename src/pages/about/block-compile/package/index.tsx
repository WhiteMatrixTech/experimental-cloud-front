import React, { useState, useEffect } from 'react';
import { Table, Button, Space } from 'antd';
import { connect } from 'dva';
import { Dispatch, history } from 'umi';
import { ConnectState } from '@/models/connect';
import { Breadcrumb } from '@/components';
import OneKeyCompile from './components/OneKeyCompile';
import { MenuList, getCurBreadcrumb } from '@/utils/menu';
import { TableColumnsAttr } from '@/utils/types';
import { JobSchema } from '@/models/block-chain-compile';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/block-compile', false);
breadCrumbItem.push({
  menuName: '任务管理',
  menuHref: `/`,
});

export type SourceCodeCompilationProps = {
  qryLoading: boolean,
  dispatch: Dispatch,
  BlockChainCompile: ConnectState['BlockChainCompile']
}

const SourceCodeCompilation: React.FC<SourceCodeCompilationProps> = (props) => {
  const { dispatch, qryLoading = false, BlockChainCompile } = props;
  const { jobList, jobTotal } = BlockChainCompile;
  const [pageNum, setPageNum] = useState(1);
  const [compileModalVisible, setCompileModalVisible] = useState(false);

  const getJobList = () => {
    dispatch({
      type: 'BlockChainCompile/getJobList',
      payload: {}
    })
  }

  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  const onClickOneKeyCompile = () => {
    setCompileModalVisible(true);
  }

  const onCancel = () => {
    setCompileModalVisible(false);
  }

  const onViewJobLog = (record: JobSchema) => {
    history.push({
      pathname: `/about/block-compile/package/job-logs`,
      state: { ...record },
    });
  }

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
      title: '任务状态',
      dataIndex: 'status',
      key: 'status',
      ellipsis: true,
    },
    {
      title: '任务信息',
      dataIndex: 'message',
      key: 'message',
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
        <div className="table-header-btn-wrapper">
          <Button type="primary" onClick={onClickOneKeyCompile}>
            一键编译
          </Button>
        </div>
        <Table
          rowKey="_id"
          loading={qryLoading}
          columns={columns}
          dataSource={jobList}
          onChange={onPageChange}
          pagination={{
            pageSize: 10,
            total: jobTotal,
            current: pageNum,
            showSizeChanger: false,
            position: ['bottomCenter'],
          }}
        />
      </div>
      {compileModalVisible && (
        <OneKeyCompile visible={compileModalVisible} onCancel={onCancel} />
      )}
    </div>
  );
}

export default connect(({ User, BlockChainCompile, loading }: ConnectState) => ({
  User,
  BlockChainCompile,
  qryLoading: loading.effects['BlockChainCompile/getJobList'],
}))(SourceCodeCompilation);
