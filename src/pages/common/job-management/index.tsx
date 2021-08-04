import React, { useState, useEffect, useCallback } from 'react';
import { Table, Space } from 'antd';
import { connect } from 'dva';
import { Dispatch, history } from 'umi';
import { ConnectState } from '~/models/connect';
import { PageTitle } from '~/components';
import { ColumnsType } from 'antd/lib/table';
import { JobSchema } from '~/models/block-chain-compile';
import baseConfig from '~/utils/config';
import styles from './index.less';

export type SourceCodeCompilationProps = {
  qryLoading: boolean;
  dispatch: Dispatch;
  BlockChainCompile: ConnectState['BlockChainCompile'];
};
const pageSize = baseConfig.pageSize;
const SourceCodeCompilation: React.FC<SourceCodeCompilationProps> = (props) => {
  const { dispatch, qryLoading = false, BlockChainCompile } = props;
  const { jobList, jobContinueData } = BlockChainCompile;
  const [moreBtnVisible, setMoreBtnVisible] = useState(false);

  const getJobList = useCallback(() => {
    dispatch({
      type: 'BlockChainCompile/getJobList',
      payload: {
        limit: pageSize
      }
    });
  }, [dispatch]);

  const getMoreJobList = () => {
    dispatch({
      type: 'BlockChainCompile/getJobList',
      payload: {
        limit: pageSize,
        continueData: jobContinueData
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

  const onViewJobLog = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: JobSchema) => {
    e.preventDefault();
    history.push({
      pathname: `/common/job-management/job-logs/${record.jobId}`,
      state: { ...record }
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: '任务ID',
      dataIndex: 'jobId',
      key: 'jobId',
      ellipsis: true
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
      key: 'jobName',
      ellipsis: true
    },
    {
      title: '任务类别',
      dataIndex: 'jobCategory',
      key: 'jobCategory',
      ellipsis: true
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      key: 'status',
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record: JobSchema) => (
        <Space size="small">
          <a href={`/common/job-management/job-logs/${record.jobId}`} onClick={(e) => onViewJobLog(e, record)}>
            查看日志
          </a>
        </Space>
      )
    }
  ];

  useEffect(() => {
    getJobList();
    return () => cleanHob();
  }, [cleanHob, getJobList]);

  useEffect(() => {
    if (jobContinueData) {
      setMoreBtnVisible(true);
    } else {
      setMoreBtnVisible(false);
    }
  }, [jobContinueData]);

  return (
    <div className="page-wrapper">
      <PageTitle label="任务管理" />
      <div className="page-content page-content-shadow table-wrapper">
        <Table
          rowKey="jobId"
          loading={qryLoading}
          columns={columns}
          dataSource={jobList}
          onChange={onPageChange}
          scroll={{ y: 450 }}
          pagination={false}
        />
        {moreBtnVisible && (
          <div className={styles.jobListMore}>
            <button className={styles.btn} onClick={getMoreJobList}>
              加载更多
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(({ User, BlockChainCompile, loading }: ConnectState) => ({
  User,
  BlockChainCompile,
  qryLoading: loading.effects['BlockChainCompile/getJobList'] || loading.effects['BlockChainCompile/getJobById']
}))(SourceCodeCompilation);
