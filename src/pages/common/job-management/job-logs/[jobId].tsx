import React, { useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Breadcrumb, DetailCard } from '~/components';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import styles from './index.less';
import { ConnectState } from '~/models/connect';
import { Dispatch, JobSchema, Location } from 'umi';
import { Intl } from '~/utils/locales';

const AU = require('ansi_up');
const ansi_up = new AU.default();

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/job-management');
breadCrumbItem.push({
  menuName: Intl.formatMessage('BASS_TASK_MANAGEMENT_LOG'),
  menuHref: `/`
});

export type JobLogsProps = {
  dispatch: Dispatch;
  location: Location<JobSchema>;
  qryLoading: boolean;
  BlockChainCompile: ConnectState['BlockChainCompile'];
  match: { params: { jobId: string } };
};

const JobLogs: React.FC<JobLogsProps> = (props) => {
  const {
    dispatch,
    location,
    qryLoading = false,
    BlockChainCompile,
    match: {
      params: { jobId }
    }
  } = props;
  const { jobLog } = BlockChainCompile;

  const detailList = useMemo(() => {
    return [
      {
        label: Intl.formatMessage('BASS_TASK_MANAGEMENT_ID'),
        value: location?.state?.jobId || ''
      },
      {
        label: Intl.formatMessage('BASS_TASK_MANAGEMENT_NAME'),
        value: location?.state?.jobName || ''
      },
      {
        label: Intl.formatMessage('BASS_TASK_MANAGEMENT_STATUS'),
        value: location?.state?.status || ''
      },
      {
        label: Intl.formatMessage('BASS_TASK_MANAGEMENT_INFORMATION'),
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
      payload: { jobId }
    });
  }, [dispatch, jobId]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle={Intl.formatMessage('BASS_COMMON_BASIC_INFORMATION')} detailList={detailList} />
          <div className={styles['detail-card-wrapper']}>
            <div className={styles['detail-card-title']}>
              <span className={styles['detail-title-content']}>
                {Intl.formatMessage('BASS_TASK_MANAGEMENT_LOG_INFORMATION')}
              </span>
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
