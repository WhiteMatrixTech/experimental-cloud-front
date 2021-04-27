import React from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import { Breadcrumb } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import styles from './index.less';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/elastic-cloud-server');
breadCrumbItem.push({
  menuName: '资源使用情况',
  menuHref: `/`,
});

function ServerPerformance(props) {
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content table-wrapper page-content-shadow">
        <div className={styles['tabs-body']}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <iframe
                src={`${process.env.RESOURCE_USAGE_DASHBOARD}&theme=dark&panelId=7`}
                title="Running Containers"
                id="Running Containers"
                frameBorder="0"
              ></iframe>
            </Col>
            <Col span={8}>
              <iframe
                src={`${process.env.RESOURCE_USAGE_DASHBOARD}&theme=dark&panelId=5`}
                title="Total Memory Usage"
                id="Total Memory Usage"
                frameBorder="0"
              ></iframe>
            </Col>
            <Col span={8}>
              <iframe
                src={`${process.env.RESOURCE_USAGE_DASHBOARD}&theme=dark&panelId=6`}
                title="Total CPU Usage"
                id="Total CPU Usage"
                frameBorder="0"
              ></iframe>
            </Col>
            <Col span={24}>
              <div className={styles['col-span-24']}>
                <iframe
                  src={`${process.env.RESOURCE_USAGE_DASHBOARD}&theme=dark&panelId=2`}
                  title="CPU Usage"
                  id="CPU Usage"
                  frameBorder="0"
                ></iframe>
              </div>
            </Col>
            <Col span={24}>
              <div className={styles['col-span-24']}>
                <iframe
                  src={`${process.env.RESOURCE_USAGE_DASHBOARD}&theme=dark&panelId=1`}
                  title="Memory Usage"
                  id="Memory Usage"
                  frameBorder="0"
                ></iframe>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles['col-span-12']}>
                <iframe
                  src={`${process.env.RESOURCE_USAGE_DASHBOARD}&theme=dark&panelId=3`}
                  title="Network Rx"
                  id="Network Rx"
                  frameBorder="0"
                ></iframe>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles['col-span-12']}>
                <iframe
                  src={`${process.env.RESOURCE_USAGE_DASHBOARD}&theme=dark&panelId=4`}
                  title="Network Tx"
                  id="Network Tx"
                  frameBorder="0"
                ></iframe>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles['col-span-12']}>
                <iframe
                  src={`${process.env.RESOURCE_USAGE_DASHBOARD}&theme=dark&panelId=8`}
                  title="I/O Rx"
                  id="I/O Rx"
                  frameBorder="0"
                ></iframe>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles['col-span-12']}>
                <iframe
                  src={`${process.env.RESOURCE_USAGE_DASHBOARD}&theme=dark&panelId=9`}
                  title="I/O Tx"
                  id="I/O Tx"
                  frameBorder="0"
                ></iframe>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default connect(({ ElasticServer, Layout, User, loading }) => ({
  ElasticServer,
  Layout,
  User,
  qryLoading: loading.effects['ElasticServer/getNodeList'],
}))(ServerPerformance);
