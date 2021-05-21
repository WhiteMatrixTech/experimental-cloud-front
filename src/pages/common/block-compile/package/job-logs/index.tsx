import React, { useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Breadcrumb, DetailCard } from '~/components';
import ReactJson from 'react-json-view';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import styles from './index.less';
import { ConnectState } from '~/models/connect';
import { Dispatch, JobSchema, Location } from 'umi';

let breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/block-compile', false);
breadCrumbItem = breadCrumbItem.concat([
  {
    menuName: '一键编译',
    menuHref: `/common/block-compile/package`,
    isLeftMenu: true,
  },
  {
    menuName: '任务日志',
    menuHref: `/`,
  },
]);

export type JobLogsProps = {
  dispatch: Dispatch;
  location: Location<JobSchema>;
  qryLoading: boolean;
  BlockChainCompile: ConnectState['BlockChainCompile'];
};

const JobLogs: React.FC<JobLogsProps> = (props) => {
  const { dispatch, location, qryLoading = false, BlockChainCompile } = props;
  const { jobLog } = BlockChainCompile;

  const detailList = useMemo(() => {
    return [
      {
        label: '任务ID',
        value: location?.state?.jobId || '',
      },
      {
        label: '任务名称',
        value: location?.state?.jobName || '',
      },
      {
        label: '任务状态',
        value: location?.state?.status || '',
      },
      {
        label: '任务信息',
        value: location?.state?.message ? JSON.stringify(location?.state?.message) : '',
      },
    ];
  }, [location?.state]);

  const getJobLog = () => {
    if (jobLog) {
      let jobLogToJson;
      try {
        let parsedData = JSON.parse(jobLog);
        jobLogToJson = parsedData;
      } catch (err) {
        jobLogToJson = { logs: jobLog };
      }
      return jobLogToJson;
    }
    return {};
  };

  useEffect(() => {
    dispatch({
      type: 'BlockChainCompile/getJobLog',
      payload: { jobId: location?.state?.jobId },
    });
  }, []);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle="基本信息" detailList={detailList} />
          <div className={styles['detail-card-wrapper']}>
            <div className={styles['detail-card-title']}>
              <span className={styles['detail-title-content']}>日志信息</span>
            </div>
            <div className={styles['detail-info-wrapper']}>
              <ReactJson name={null} src={getJobLog()} />
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default connect(({ BlockChainCompile, loading }: ConnectState) => ({
  BlockChainCompile,
  qryLoading: loading.effects['BlockChainCompile/getJobDetail'] || loading.effects['BlockChainCompile/getJobLog'],
}))(JobLogs);
