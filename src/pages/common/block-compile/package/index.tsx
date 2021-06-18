import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space } from 'antd';
import { connect } from 'dva';
import { Dispatch, history } from 'umi';
import { ConnectState } from '~/models/connect';
import { Breadcrumb } from '~/components';
import OneKeyCompile from './components/OneKeyCompile';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import { GitBuildRepoTask } from '~/models/block-chain-compile';
import { ColumnsType } from 'antd/lib/table';
import baseConfig from '~/utils/config';
import styles from './index.less';

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/block-compile', false);
breadCrumbItem.push({
  menuName: '一键编译',
  menuHref: `/`
});

export type SourceCodeCompilationProps = {
  qryLoading: boolean;
  dispatch: Dispatch;
  BlockChainCompile: ConnectState['BlockChainCompile'];
};
const pageSize = baseConfig.pageSize;
const SourceCodeCompilation: React.FC<SourceCodeCompilationProps> = (props) => {
  const { dispatch, qryLoading = false, BlockChainCompile } = props;
  const { gitBuildJobList, compileContinueData } = BlockChainCompile;
  const [compileModalVisible, setCompileModalVisible] = useState(false);
  const [moreBtnVisible, setMoreBtnVisible] = useState(false);

  const getCompileJobList = useCallback(() => {
    dispatch({
      type: 'BlockChainCompile/getCompileJobList',
      payload: {
        limit: pageSize
      }
    });
  }, [dispatch]);

  const getMoreCompileJobList = () => {
    dispatch({
      type: 'BlockChainCompile/getJobList',
      payload: {
        limit: pageSize,
        continueData: compileContinueData
      }
    });
  };

  const cleanHob = useCallback(() => {
    dispatch({
      type: 'BlockChainCompile/cleanJob',
      payload: {}
    });
  }, [dispatch]);

  const onPageChange = (pageInfo: any) => {
    // 页码改变
  };

  const onClickOneKeyCompile = () => {
    setCompileModalVisible(true);
  };

  const onCancel = () => {
    setCompileModalVisible(false);
    getCompileJobList();
  };

  const onViewJobLog = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: GitBuildRepoTask) => {
    e.preventDefault();
    history.push({
      pathname: `/common/block-compile/package/job-logs/${record.buildJobId}`,
      state: {
        ...record,
        jobId: record.buildJobId,
        status: record.buildJobStatus
      }
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: '仓库地址',
      dataIndex: 'gitRepoUrl',
      key: 'gitRepoUrl',
      ellipsis: true
    },
    {
      title: '分支名',
      dataIndex: 'branch',
      key: 'branch',
      ellipsis: true
    },
    {
      title: '编译镜像',
      dataIndex: 'buildEnvImage',
      key: 'buildEnvImage',
      ellipsis: true
    },
    {
      title: '编译命令',
      dataIndex: 'buildCommands',
      key: 'buildCommands',
      ellipsis: true
    },
    {
      title: '任务ID',
      dataIndex: 'buildJobId',
      key: 'buildJobId',
      ellipsis: true
    },
    {
      title: '任务状态',
      dataIndex: 'buildJobStatus',
      key: 'buildJobStatus',
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record: GitBuildRepoTask) => (
        <Space size="small">
          <a
            href={`/common/block-compile/package/job-logs/${record.buildJobId}`}
            onClick={(e) => onViewJobLog(e, record)}>
            查看日志
          </a>
        </Space>
      )
    }
  ];

  useEffect(() => {
    getCompileJobList();
    return () => cleanHob();
  }, [cleanHob, getCompileJobList]);

  useEffect(() => {
    if (compileContinueData) {
      setMoreBtnVisible(true);
    } else {
      setMoreBtnVisible(false);
    }
  }, [compileContinueData]);

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
          scroll={{ y: 450 }}
          pagination={false}
        />
        {moreBtnVisible && (
          <div className={styles.jobListMore}>
            <button className={styles.btn} onClick={getMoreCompileJobList}>
              加载更多
            </button>
          </div>
        )}
      </div>
      {compileModalVisible && <OneKeyCompile visible={compileModalVisible} onCancel={onCancel} />}
    </div>
  );
};

export default connect(({ User, BlockChainCompile, loading }: ConnectState) => ({
  User,
  BlockChainCompile,
  qryLoading: loading.effects['BlockChainCompile/getCompileJobList']
}))(SourceCodeCompilation);
