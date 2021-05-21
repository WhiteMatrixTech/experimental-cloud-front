import React, { useState, useEffect } from 'react';
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
  menuHref: `/`,
});

export type SourceCodeCompilationProps = {
  qryLoading: boolean;
  dispatch: Dispatch;
  BlockChainCompile: ConnectState['BlockChainCompile'];
};
const pageSize = baseConfig.pageSize;
const SourceCodeCompilation: React.FC<SourceCodeCompilationProps> = (props) => {
  const { dispatch, qryLoading = false, BlockChainCompile } = props;
  const { gitBuildJobList, gitBuildJobTotal, compileContinueData } = BlockChainCompile;
  const [pageNum, setPageNum] = useState(1);
  const [compileModalVisible, setCompileModalVisible] = useState(false);
  const [moreBtnVisible, setMoreBtnVisible] = useState(false);

  //获取编译模块的列表
  const getCompileJobList = () => {
    dispatch({
      type: 'BlockChainCompile/getCompileJobList',
      payload: {
        limit: pageSize,
      },
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
    getCompileJobList();
  };

  const onViewJobLog = (record: GitBuildRepoTask) => {
    history.push({
      pathname: `/common/block-compile/package/job-logs`,
      state: {
        ...record,
        jobId: record.buildJobId,
        status: record.buildJobStatus,
      },
    });
  };

  const columns: ColumnsType<any> = [
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

  useEffect(() => {
    if (compileContinueData) {
      if (gitBuildJobTotal > pageSize) {
        setMoreBtnVisible(true);
      }
    }
  }, [compileContinueData]);

  //获取更多编译任务
  const getMoreCompileJobList = () => {
    dispatch({
      type: 'BlockChainCompile/getJobList',
      payload: {
        limit: pageSize,
        continueData: compileContinueData,
      },
    });
  };
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
        <div className={styles.jobListMore}>
          <button
            className={styles.btn}
            onClick={getMoreCompileJobList}
            style={{ display: moreBtnVisible ? 'block' : 'none' }}
          >
            更多
          </button>
        </div>
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
