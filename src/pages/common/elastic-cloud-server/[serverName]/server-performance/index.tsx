import React from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import { Breadcrumb } from '~/components';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import styles from './index.less';
import { ConnectState } from '~/models/connect';
import { Dispatch, ElasticServerSchema, Location } from 'umi';

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/elastic-cloud-server');
breadCrumbItem.push({
  menuName: '资源使用情况',
  menuHref: `/`
});
export interface ServerPerformanceProps {
  location: Location<ElasticServerSchema>;
  dispatch: Dispatch;
}
function ServerPerformance(props: ServerPerformanceProps) {
  const { location } = props;
  const publicIp = location?.state?.publicIp;

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content table-wrapper page-content-shadow">
        <div className={styles['tabs-body']}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <iframe
                src={`${process.env.RESOURCE_USAGE_DASHBOARD}&var-node=${publicIp}&theme=light&panelId=7`}
                title="Running Containers"
                id="Running Containers"
                frameBorder="0"></iframe>
            </Col>
            <Col span={8}>
              <iframe
                src={`${process.env.RESOURCE_USAGE_DASHBOARD}&var-node=${publicIp}&theme=light&panelId=5`}
                title="Total Memory Usage"
                id="Total Memory Usage"
                frameBorder="0"></iframe>
            </Col>
            <Col span={8}>
              <iframe
                src={`${process.env.RESOURCE_USAGE_DASHBOARD}&var-node=${publicIp}&theme=light&panelId=6`}
                title="Total CPU Usage"
                id="Total CPU Usage"
                frameBorder="0"></iframe>
            </Col>
            <Col span={24}>
              <div className={styles['col-span-24']}>
                <iframe
                  src={`${process.env.RESOURCE_USAGE_DASHBOARD}&var-node=${publicIp}&theme=light&panelId=2`}
                  title="CPU Usage"
                  id="CPU Usage"
                  frameBorder="0"></iframe>
              </div>
            </Col>
            <Col span={24}>
              <div className={styles['col-span-24']}>
                <iframe
                  src={`${process.env.RESOURCE_USAGE_DASHBOARD}&var-node=${publicIp}&theme=light&panelId=1`}
                  title="Memory Usage"
                  id="Memory Usage"
                  frameBorder="0"></iframe>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles['col-span-12']}>
                <iframe
                  src={`${process.env.RESOURCE_USAGE_DASHBOARD}&var-node=${publicIp}&theme=light&panelId=3`}
                  title="Network Rx"
                  id="Network Rx"
                  frameBorder="0"></iframe>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles['col-span-12']}>
                <iframe
                  src={`${process.env.RESOURCE_USAGE_DASHBOARD}&var-node=${publicIp}&theme=light&panelId=4`}
                  title="Network Tx"
                  id="Network Tx"
                  frameBorder="0"></iframe>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles['col-span-12']}>
                <iframe
                  src={`${process.env.RESOURCE_USAGE_DASHBOARD}&var-node=${publicIp}&theme=light&panelId=8`}
                  title="I/O Rx"
                  id="I/O Rx"
                  frameBorder="0"></iframe>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles['col-span-12']}>
                <iframe
                  src={`${process.env.RESOURCE_USAGE_DASHBOARD}&var-node=${publicIp}&theme=light&panelId=9`}
                  title="I/O Tx"
                  id="I/O Tx"
                  frameBorder="0"></iframe>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default connect(({ ElasticServer, Layout, User, loading }: ConnectState) => ({
  ElasticServer,
  Layout,
  User,
  qryLoading: loading.effects['ElasticServer/getNodeList']
}))(ServerPerformance);
