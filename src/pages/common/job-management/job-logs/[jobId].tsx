import React, { useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Descriptions, Divider, Empty, Spin } from 'antd';
import { Breadcrumb, PageTitle } from '~/components';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import { ConnectState } from '~/models/connect';
import { Dispatch, JobSchema, Location } from 'umi';

const AU = require('ansi_up');
const ansi_up = new AU.default();

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/job-management');
breadCrumbItem.push({
  menuName: '任务日志',
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
      payload: { jobId }
    });
  }, [dispatch, jobId]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <PageTitle label="任务日志" />
      <Spin spinning={qryLoading}>
        <div className="page-content">
          <Descriptions title="基本信息" className="descriptions-wrapper">
            {detailList.map(item =>
              <Descriptions.Item
                key={item.label}
                label={item.label}>
                {item.value}
              </Descriptions.Item>
            )}
          </Descriptions>
          <div className="table-wrapper page-content-shadow">
            <div className="table-header-title">日志信息</div>
            <Divider />
            <div id="job-logs">
              {!jobLog && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default connect(({ BlockChainCompile, loading }: ConnectState) => ({
  BlockChainCompile,
  qryLoading: loading.effects['BlockChainCompile/getJobDetail'] || loading.effects['BlockChainCompile/getJobLog']
}))(JobLogs);
