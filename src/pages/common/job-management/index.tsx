import React, { useState, useEffect } from 'react';
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

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/job-management', false);

export type SourceCodeCompilationProps = {
  qryLoading: boolean;
  dispatch: Dispatch;
  BlockChainCompile: ConnectState['BlockChainCompile'];
};
const pageSize = baseConfig.pageSize;
const SourceCodeCompilation: React.FC<SourceCodeCompilationProps> = (props) => {
  const { dispatch, qryLoading = false, BlockChainCompile } = props;
  const { jobList, jobTotal, jobContinueData } = BlockChainCompile;
  const [pageNum, setPageNum] = useState(1);
  const [moreBtnVisible, setMoreBtnVisible] = useState(false);

  const getJobList = () => {
    dispatch({
      type: 'BlockChainCompile/getJobList',
      payload: {
        limit: pageSize,
      },
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

  const columns: ColumnsType<any> = [
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

  useEffect(() => {
    if (jobTotal >= pageSize) {
      setMoreBtnVisible(true);
    }
  }, [jobContinueData]);
  //获取更多
  const getMoreJobList = () => {
    dispatch({
      type: 'BlockChainCompile/getJobList',
      payload: {
        limit: pageSize,
        continueData: jobContinueData,
      },
    });
  };
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
            hideOnSinglePage: true,
          }}
        />
        <div className={styles.jobListMore}>
          <button
            className={styles.btn}
            onClick={getMoreJobList}
            style={{ display: moreBtnVisible ? 'block' : 'none' }}
          >
            加载更多
          </button>
        </div>
      </div>
    </div>
  );
};

export default connect(({ User, BlockChainCompile, loading }: ConnectState) => ({
  User,
  BlockChainCompile,
  qryLoading: loading.effects['BlockChainCompile/getJobList'] || loading.effects['BlockChainCompile/getJobById'],
}))(SourceCodeCompilation);
