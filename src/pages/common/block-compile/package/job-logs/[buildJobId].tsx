import React, { useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Breadcrumb, DetailCard } from '~/components';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import styles from './index.less';
import { ConnectState } from '~/models/connect';
import { Dispatch, JobSchema, Location } from 'umi';

const AU = require('ansi_up');
const ansi_up = new AU.default();

let breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/block-compile', false);
breadCrumbItem = breadCrumbItem.concat([
  {
    menuName: '一键编译',
    menuHref: `/common/block-compile/package`,
    isLeftMenu: true
  },
  {
    menuName: '任务日志',
    menuHref: `/`
  }
]);

export type JobLogsProps = {
  dispatch: Dispatch;
  location: Location<JobSchema>;
  qryLoading: boolean;
  BlockChainCompile: ConnectState['BlockChainCompile'];
  match: { params: { buildJobId: string } };
};

const JobLogs: React.FC<JobLogsProps> = (props) => {
  const {
    dispatch,
    location,
    qryLoading = false,
    BlockChainCompile,
    match: {
      params: { buildJobId }
    }
  } = props;
  const { jobLog } = BlockChainCompile;

  const detailList = useMemo(() => {
    return [
      {
        label: '任务ID',
        value: location?.state?.jobId || ''
      },
      {
        label: '任务名称',
        value: location?.state?.jobName || ''
      },
      {
        label: '任务状态',
        value: location?.state?.status || ''
      },
      {
        label: '任务信息',
        value: location?.state?.message ? JSON.stringify(location?.state?.message) : ''
      }
    ];
  }, [location?.state]);

  useEffect(() => {
    const logDiv = document.getElementById('job-logs');
    if (jobLog && logDiv) {
      logDiv.innerHTML = ansi_up.ansi_to_html(jobLog).replace(/\n/g, '<br>');
    }
  }, [jobLog]);

  useEffect(() => {
    dispatch({
      type: 'BlockChainCompile/getJobLog',
      payload: { jobId: buildJobId }
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
            <div id="job-logs" className={styles['detail-info-wrapper']}></div>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default connect(({ BlockChainCompile, loading }: ConnectState) => ({
  BlockChainCompile,
  qryLoading: loading.effects['BlockChainCompile/getJobDetail'] || loading.effects['BlockChainCompile/getJobLog']
}))(JobLogs);
