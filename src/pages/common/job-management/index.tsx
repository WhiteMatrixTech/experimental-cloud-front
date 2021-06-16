import React, { useState, useEffect, useCallback } from 'react';
import { Table, Space } from 'antd';
import { connect } from 'dva';
import { Dispatch, history } from 'umi';
import { ConnectState } from '~/models/connect';
import { Breadcrumb } from '~/components';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import { ColumnsType } from 'antd/lib/table';
import { JobSchema } from '~/models/block-chain-compile';
import baseConfig from '~/utils/config';
import styles from './index.less';
import { Intl } from '~/utils/locales';

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/job-management', false);

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
      title: Intl.formatMessage('BASS_TASK_MANAGEMENT_ID'),
      dataIndex: 'jobId',
      key: 'jobId',
      ellipsis: true
    },
    {
      title: Intl.formatMessage('BASS_TASK_MANAGEMENT_NAME'),
      dataIndex: 'jobName',
      key: 'jobName',
      ellipsis: true
    },
    {
      title: Intl.formatMessage('BASS_TASK_MANAGEMENT_TYPE'),
      dataIndex: 'jobCategory',
      key: 'jobCategory',
      ellipsis: true
    },
    {
      title: Intl.formatMessage('BASS_TASK_MANAGEMENT_STATUS'),
      dataIndex: 'status',
      key: 'status',
      ellipsis: true
    },
    {
      title: Intl.formatMessage('BASS_COMMON_OPERATION'),
      key: 'action',
      render: (text, record: JobSchema) => (
        <Space size="small">
          <a href={`/common/job-management/job-logs/${record.jobId}`} onClick={(e) => onViewJobLog(e, record)}>
            {Intl.formatMessage('BASS_TASK_MANAGEMENT_VIEW_LOG')}
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
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
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
              {Intl.formatMessage('BASS_ONE_KEY_COMPILE_LOADING_MORE')}
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
