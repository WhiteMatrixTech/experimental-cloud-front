import React from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

export default function GoMetrics() {
  return (
    <div className={styles['tabs-body']}>
      <Row gutter={[16, 12]}>
        <Col span={12}>
          <iframe
            src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=light&panelId=23`}
            title="Go Memory Allocations"
            id="Go Memory Allocations"
            frameBorder="0"
          ></iframe>
        </Col>
        <Col span={12}>
          <iframe
            src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=light&panelId=27`}
            title="Go Heap Objects"
            id="Go Heap Objects"
            frameBorder="0"
          ></iframe>
        </Col>
        <Col span={12}>
          <div className={styles['fabric-panel']}>
            <iframe
              src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=light&panelId=25`}
              title="Go Garbage Collection"
              id="Go Garbage Collection"
              frameBorder="0"
            ></iframe>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles['fabric-panel']}>
            <iframe
              src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=light&panelId=26`}
              title="Go Free Memory"
              id="Go Free Memory"
              frameBorder="0"
            ></iframe>
          </div>
        </Col>
      </Row>
    </div>
  );
}
