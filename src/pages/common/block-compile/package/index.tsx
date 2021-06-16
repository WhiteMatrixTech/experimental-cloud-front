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
import { Intl } from '~/utils/locales';

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/block-compile', false);
breadCrumbItem.push({
  menuName: Intl.formatMessage('BASS_ONE_KEY_COMPILE'),
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
      title: Intl.formatMessage('BASS_ONE_KEY_COMPILE_RESPOSITORY_ADDRESS'),
      dataIndex: 'gitRepoUrl',
      key: 'gitRepoUrl',
      ellipsis: true
    },
    {
      title: Intl.formatMessage('BASS_ONE_KEY_COMPILE_BRANCH_NAME'),
      dataIndex: 'branch',
      key: 'branch',
      ellipsis: true
    },
    {
      title: Intl.formatMessage('BASS_ONE_KEY_COMPILE_IMAGE'),
      dataIndex: 'buildEnvImage',
      key: 'buildEnvImage',
      ellipsis: true
    },
    {
      title: Intl.formatMessage('BASS_ONE_KEY_COMPILE_COMMANDS'),
      dataIndex: 'buildCommands',
      key: 'buildCommands',
      ellipsis: true
    },
    {
      title: Intl.formatMessage('BASS_TASK_MANAGEMENT_ID'),
      dataIndex: 'buildJobId',
      key: 'buildJobId',
      ellipsis: true
    },
    {
      title: Intl.formatMessage('BASS_TASK_MANAGEMENT_STATUS'),
      dataIndex: 'buildJobStatus',
      key: 'buildJobStatus',
      ellipsis: true
    },
    {
      title: Intl.formatMessage('BASS_COMMON_OPERATION'),
      key: 'action',
      render: (text, record: GitBuildRepoTask) => (
        <Space size="small">
          <a
            href={`/common/block-compile/package/job-logs/${record.buildJobId}`}
            onClick={(e) => onViewJobLog(e, record)}>
            {Intl.formatMessage('BASS_TASK_MANAGEMENT_VIEW_LOG')}
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
            {Intl.formatMessage('BASS_ONE_KEY_COMPILE')}
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
              {Intl.formatMessage('BASS_ONE_KEY_COMPILE_LOADING_MORE')}
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
