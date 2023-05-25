import React from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

export default function OrdererMetrics() {
  return (
    <div className={styles['tabs-body']}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <iframe
            src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=light&panelId=8`}
            title="Order Broadcasts"
            id="Order Broadcasts"
            frameBorder="0"
          ></iframe>
        </Col>
      </Row>
    </div>
  );
}
