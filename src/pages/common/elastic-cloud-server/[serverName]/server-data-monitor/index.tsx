import React from 'react';
import { connect } from 'dva';
import { Row, Col, Collapse } from 'antd';
import { ConnectState } from '~/models/connect';
import { Dispatch, ElasticServerSchema, Location } from 'umi';
import { Breadcrumb } from '~/components';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import styles from './index.less';

const { Panel } = Collapse;

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/elastic-cloud-server');
breadCrumbItem.push({
  menuName: '服务器数据监控',
  menuHref: `/`
});
export interface ServerDataMonitorProps {
  location: Location<ElasticServerSchema>;
  dispatch: Dispatch;
}
const ServerDataMonitor: React.FC<ServerDataMonitorProps> = (props) => {
  const { location } = props;
  const publicIp = `${location?.state?.publicIp}:30000`;

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className={styles.monitor}>
        <Collapse bordered={false} defaultActiveKey={['total']} ghost>
          <Panel header={`资源总览（关联JOB项）当前选中主机：27b85fd1fd19，实例：${publicIp}`} key="total">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className={styles['iframe-300h']}>
                  <iframe
                    src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=185`}
                    title="Server Total Monitor"
                    id="Server Total Monitor"
                    frameBorder="0"></iframe>
                </div>
              </Col>
            </Row>
          </Panel>
          <Panel header="资源明细：【27b85fd1fd19】" key="detail">
            <Row gutter={[16, 16]}>
              <Col span={2}>
                <Row gutter={[16, 12]}>
                  <Col span={24}>
                    <div className={styles['iframe-70h']}>
                      <iframe
                        src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=15`}
                        title="Server Run Time"
                        id="Server Run Time"
                        frameBorder="0"></iframe>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className={styles['iframe-70h']}>
                      <iframe
                        src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=14`}
                        title="Server CPU Core"
                        id="Server CPU Core"
                        frameBorder="0"></iframe>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className={styles['iframe-70h']}>
                      <iframe
                        src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=75`}
                        title="Server Total Memory"
                        id="Server Total Memory"
                        frameBorder="0"></iframe>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col span={4}>
                <div className={styles['iframe-245h']}>
                  <iframe
                    src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=177`}
                    title="Server Total Usage"
                    id="Server Total Usage"
                    frameBorder="0"></iframe>
                </div>
              </Col>
              <Col span={10}>
                <div className={styles['iframe-245h']}>
                  <iframe
                    src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=181`}
                    title="Server Disk Partitions"
                    id="Server Disk Partitions"
                    frameBorder="0"></iframe>
                </div>
              </Col>
              <Col span={2}>
                <Row gutter={[16, 12]}>
                  <Col span={24}>
                    <div className={styles['iframe-70h']}>
                      <iframe
                        src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=20`}
                        title="Server CPU IO Wait"
                        id="Server CPU IO Wait"
                        frameBorder="0"></iframe>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className={styles['iframe-70h']}>
                      <iframe
                        src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=179`}
                        title="Server Rest Node Number"
                        id="Server Rest Node Number"
                        frameBorder="0"></iframe>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className={styles['iframe-70h']}>
                      <iframe
                        src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=178`}
                        title="Server Total File Descriptor"
                        id="Server Total File Descriptor"
                        frameBorder="0"></iframe>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col span={6}>
                <div className={styles['iframe-245h']}>
                  <iframe
                    src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=183`}
                    title="Server Traffic per Hour"
                    id="Server Traffic per Hour"
                    frameBorder="0"></iframe>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles['iframe-300h']}>
                  <iframe
                    src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=7`}
                    title="Server CPU Usage"
                    id="Server CPU Usage"
                    frameBorder="0"></iframe>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles['iframe-300h']}>
                  <iframe
                    src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=156`}
                    title="Server Memory Info"
                    id="Server Memory Info"
                    frameBorder="0"></iframe>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles['iframe-300h']}>
                  <iframe
                    src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=157`}
                    title="Network Bandwidth Usage per Second"
                    id="Network Bandwidth Usage per Second"
                    frameBorder="0"></iframe>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles['iframe-300h']}>
                  <iframe
                    src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=13`}
                    title="Average System Load"
                    id="Average System Load"
                    frameBorder="0"></iframe>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles['iframe-300h']}>
                  <iframe
                    src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=168`}
                    title="Disk Reads and Writes per Second"
                    id="Disk Reads and Writes per Second"
                    frameBorder="0"></iframe>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles['iframe-300h']}>
                  <iframe
                    src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=174`}
                    title="Disk Usage"
                    id="Disk Usage"
                    frameBorder="0"></iframe>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles['iframe-300h']}>
                  <iframe
                    src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=161`}
                    title="IOPS"
                    id="IOPS"
                    frameBorder="0"></iframe>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles['iframe-300h']}>
                  <iframe
                    src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=175`}
                    title="IO Operation Time Ratio per Second"
                    id="IO Operation Time Ratio per Second"
                    frameBorder="0"></iframe>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles['iframe-300h']}>
                  <iframe
                    src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=160`}
                    title="One IO Operation Elapsed Time"
                    id="One IO Operation Elapsed Time"
                    frameBorder="0"></iframe>
                </div>
              </Col>
              <Col span={16}>
                <div className={styles['iframe-300h']}>
                  <iframe
                    src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=158`}
                    title="Network Socket Connect"
                    id="Network Socket Connect"
                    frameBorder="0"></iframe>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles['iframe-300h']}>
                  <iframe
                    src={`${process.env.SERVER_PERFORMANCE_MONITOR}&var-node=${publicIp}&theme=dark&panelId=16`}
                    title="Opened File Descriptions(Left)/Context Switch Time per Second(Right)"
                    id="Opened File Descriptions(Left)/Context Switch Time per Second(Right)"
                    frameBorder="0"></iframe>
                </div>
              </Col>
            </Row>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
}

export default connect(({ ElasticServer, Layout, User, loading }: ConnectState) => ({
  ElasticServer,
  Layout,
  User,
  qryLoading: loading.effects['ElasticServer/getNodeList']
}))(ServerDataMonitor);
