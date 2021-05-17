import React, { useState, useEffect } from 'react';
import { Table, Button, Space } from 'antd';
import { connect } from 'dva';
import { Dispatch, history } from 'umi';
import { ConnectState } from '@/models/connect';
import { Breadcrumb } from '@/components';
import OneKeyCompile from './components/OneKeyCompile';
import { CommonMenuList, getCurBreadcrumb } from '@/utils/menu';
import { TableColumnsAttr } from '@/utils/types';
import { GitBuildRepoTask } from '@/models/block-chain-compile';

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/block-compile', false);
breadCrumbItem.push({
  menuName: '一键编译',
  menuHref: `/`,
});

export type SourceCodeCompilationProps = {
  qryLoading: boolean;
  dispatch: Dispatch;
  BlockChainCompile: ConnectState['BlockChainCompile'];
};

const SourceCodeCompilation: React.FC<SourceCodeCompilationProps> = (props) => {
  const { dispatch, qryLoading = false, BlockChainCompile } = props;
  const { gitBuildJobList, gitBuildJobTotal } = BlockChainCompile;
  const [pageNum, setPageNum] = useState(1);
  const [compileModalVisible, setCompileModalVisible] = useState(false);

  const getCompileJobList = () => {
    dispatch({
      type: 'BlockChainCompile/getCompileJobList',
      payload: {},
    });
  };

  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  const onClickOneKeyCompile = () => {
    setCompileModalVisible(true);
  };

  const onCancel = () => {
    setCompileModalVisible(false);
  };

  const onViewJobLog = (record: GitBuildRepoTask) => {
    dispatch({
      type: 'Layout/common',
      payload: { commonPortalSelectedMenu: '/common/job-management' },
    });
    history.push({
      pathname: `/common/job-management/job-logs`,
      state: {
        ...record,
        jobId: record.buildJobId,
        status: record.buildJobStatus,
      },
    });
  };

  const columns: TableColumnsAttr[] = [
    {
      title: '仓库地址',
      dataIndex: 'gitRepoUrl',
      key: 'gitRepoUrl',
      ellipsis: true,
    },
    {
      title: '分支名',
      dataIndex: 'branch',
      key: 'branch',
      ellipsis: true,
    },
    {
      title: '编译镜像名',
      dataIndex: 'buildEnvImage',
      key: 'buildEnvImage',
      ellipsis: true,
    },
    {
      title: '编译命令',
      dataIndex: 'buildCommands',
      key: 'buildCommands',
      ellipsis: true,
    },
    {
      title: '任务ID',
      dataIndex: 'buildJobId',
      key: 'buildJobId',
      ellipsis: true,
    },
    {
      title: '任务状态',
      dataIndex: 'buildJobStatus',
      key: 'buildJobStatus',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record: GitBuildRepoTask) => (
        <Space size="small">
          <a onClick={() => onViewJobLog(record)}>查看日志</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getCompileJobList();
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
          rowKey="buildJobId"
          loading={qryLoading}
          columns={columns}
          dataSource={gitBuildJobList}
          onChange={onPageChange}
          pagination={{
            pageSize: 10,
            total: gitBuildJobTotal,
            current: pageNum,
            showSizeChanger: false,
            position: ['bottomCenter'],
          }}
        />
      </div>
      {compileModalVisible && <OneKeyCompile visible={compileModalVisible} onCancel={onCancel} />}
    </div>
  );
};

export default connect(({ User, BlockChainCompile, loading }: ConnectState) => ({
  User,
  BlockChainCompile,
  qryLoading: loading.effects['BlockChainCompile/getCompileJobList'],
}))(SourceCodeCompilation);
